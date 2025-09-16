// routes/posts.js
import express from "express";
import {
  getPosts, getPostById, createPost, updatePost, deletePost,
  getCommentsByPost, createComment, updateComment, deleteComment
} from "../controllers/postController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);

// COMMENTS routes (must come before router.get("/:id"))
router.get("/:id/comments", getCommentsByPost);
router.post("/:id/comments", authenticate, createComment);
router.put("/:postId/comments/:commentId", authenticate, updateComment);
router.delete("/:postId/comments/:commentId", authenticate, deleteComment);

router.get("/:id", getPostById);
router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
