// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="container mt-4">
      {user && <h5>Welcome, {user.name} 👋</h5>}
      <h2 className="mb-4">All Posts</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content.slice(0, 200)}...</p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Posted by {post.author || "Unknown"}
                  </small>
                  <Link
                    to={`/post/${post.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
