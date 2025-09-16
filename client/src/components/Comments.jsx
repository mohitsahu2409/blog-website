// src/components/Comments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CommentForm from "./CommentForm";


function Comments({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (commentId) => {
    if (!user) return alert("Please login to delete comment");
    if (!window.confirm("Delete comment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to delete");
        return;
      }
      setComments((c) => c.filter((x) => x.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h5>Comments ({comments.length})</h5>
      <CommentForm postId={postId} onNewComment={(c) => setComments((prev) => [...prev, c])} />
      {loading ? (
        <div>Loading comments...</div>
      ) : comments.length === 0 ? (
        <div>No comments yet. Be the first!</div>
      ) : (
        <ul className="list-group mt-3">
          {comments.map((c) => (
            <li key={c.id} className="list-group-item">
              <strong>{c.author || "User"}</strong>{" "}
              <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
              <div className="mt-2">{c.content}</div>
              {user && user.id === c.user_id && (
                <div className="mt-2">
                  {/* Add edit UI if you want; delete button provided */}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
