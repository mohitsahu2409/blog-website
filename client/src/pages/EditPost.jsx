// src/pages/EditPost.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditPost() {
  const { id } = useParams(); // post id from the URL
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch the existing post data
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        const data = await res.json();
        setForm({ title: data.title, content: data.content });
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  // ✅ Submit updated post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Post updated successfully!");
      navigate("/");
    } else {
      const error = await res.json();
      alert(error.message || "Failed to update post");
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Post</h2>
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
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button className="btn btn-success mt-2" type="submit">
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
