// src/components/CommentForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function CommentForm({ postId, onNewComment }) {
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return alert("Please login to comment.");
    }
    if (!content.trim()) return alert("Enter a comment");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Failed to post comment");
      }

      const data = await res.json();
      // optimistic: append new comment
      onNewComment(data);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <textarea
        className="form-control"
        placeholder={user ? "Write a comment..." : "Login to write a comment"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        disabled={!user}
      />
      <div className="mt-2">
        <button className="btn btn-sm btn-primary" type="submit" disabled={!user}>
          Post Comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
