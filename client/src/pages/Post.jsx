// src/pages/Post.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Comments from "../components/Comments"; // ✅ import comments section

function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        console.log("Fetching post with id:", id);
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        console.log("Fetched Data", data);
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  // ✅ Delete Post
  const handleDelete = async () => {
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    if (user.id !== post.user_id) {
      alert("You are not allowed to delete this post.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Post deleted successfully!");
        navigate("/");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (!post) return <div className="text-center mt-4">Post not found</div>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small className="text-muted">
        Posted by {post.author} on{" "}
        {new Date(post.created_at).toLocaleString()}
      </small>

      {/* ✅ Only owner sees Edit/Delete */}
      {user && user.id === post.user_id && (
        <div className="mt-3 d-flex gap-2">
          <Link to={`/edit/${post.id}`} className="btn btn-warning">
            Edit
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      {/* ✅ Comments Section */}
      <Comments postId={post.id} />
    </div>
  );
}

export default Post;
