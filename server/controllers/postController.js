import { pool } from "../db/db.js";

// controllers/postController.js

// ✅ Fetch all posts
export async function getPosts(req, res) {
  try {
    const result = await pool.query(`
      SELECT posts.id, posts.title, posts.content, posts.created_at,
             posts.user_id AS "user_id",             
             users.name AS author
      FROM posts
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

// ✅ Fetch single post
export async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT posts.id, posts.title, posts.content, posts.created_at,
              posts.user_id AS "user_id",   
              users.name AS author
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post row from DB:", result.rows[0]);
    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
}


export async function createPost(req, res) {
  const { title, content } = req.body;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
}

export async function updatePost(req, res) {
  const { title, content } = req.body;
  const postId = req.params.id;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, content, postId, userId]
    );
    if (result.rows.length === 0) return res.status(403).json({ message: "Not allowed" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
}

export async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.user.id;
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *",
      [postId, userId]
    );
    if (result.rows.length === 0) return res.status(403).json({ message: "Not allowed" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
}

// controllers/postController.js (append these)

export async function getCommentsByPost(req, res) {
  const postId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.name AS author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
}

export async function createComment(req, res) {
  const postId = req.params.id;
  const userId = req.user.id; // from authenticate middleware
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ message: "Content required" });

  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, content, created_at, user_id`,
      [postId, userId, content]
    );
    const inserted = result.rows[0];

    // Optional: attach author name
    const authorRes = await pool.query(`SELECT name FROM users WHERE id = $1`, [userId]);
    const author = authorRes.rows[0]?.name || null;

    res.status(201).json({ ...inserted, author });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

export async function updateComment(req, res) {
  const { postId, commentId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ message: "Content required" });

  try {
    // ensure owner
    const check = await pool.query(`SELECT user_id FROM comments WHERE id = $1 AND post_id = $2`, [commentId, postId]);
    if (check.rows.length === 0) return res.status(404).json({ message: "Comment not found" });
    if (check.rows[0].user_id !== userId) return res.status(403).json({ message: "Not allowed" });

    const result = await pool.query(
      `UPDATE comments SET content = $1 WHERE id = $2 RETURNING id, content, created_at, user_id`,
      [content, commentId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update comment" });
  }
}

export async function deleteComment(req, res) {
  const { postId, commentId } = req.params;
  const userId = req.user.id;
  try {
    const check = await pool.query(`SELECT user_id FROM comments WHERE id = $1 AND post_id = $2`, [commentId, postId]);
    if (check.rows.length === 0) return res.status(404).json({ message: "Comment not found" });
    if (check.rows[0].user_id !== userId) return res.status(403).json({ message: "Not allowed" });

    await pool.query(`DELETE FROM comments WHERE id = $1`, [commentId]);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
}

