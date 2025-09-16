// src/pages/CreatePost.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreatePost() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Post created successfully!");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="form-control my-2"
          placeholder="Content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button className="btn btn-success mt-2" type="submit">
          Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
