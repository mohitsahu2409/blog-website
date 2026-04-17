# 🖊️ AI-Powered Blog Platform

A full-stack blog web application with secure authentication, post management, comments, cloud database integration, and AI-powered blog summarization.

## 🚀 Live Demo

| Service | URL |
|--------|-----|
| 🌐 Frontend | [blog-website-kappa-flame.vercel.app](https://blog-website-kappa-flame.vercel.app) |
| 🔗 Backend API | [blog-website-ai.onrender.com/api/posts](https://blog-website-ai.onrender.com/api/posts) |

---

## ✨ Features

### 🔐 Authentication
- User Signup and Login
- JWT-based authentication with protected routes
- Persistent login sessions across page refresh

### 📝 Blog Management
- Create, edit, and delete your own posts
- View all posts or individual post pages

### 💬 Comments System
- Add comments to any post
- View all comments threaded under posts

### 🤖 AI Integration
- Generate AI-powered summaries for blog posts
- OpenAI API integration with graceful fallback on quota/API errors

### 📱 Responsive UI
- Mobile-friendly responsive navbar
- Clean Bootstrap-based layout across desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, React Router DOM, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **AI** | OpenAI API |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📂 Project Structure

```
blog-website/
├── client/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
├── server/         # Node.js backend
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   │   ├── db/
│   └── index.js
└── README.md
```

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running
- An OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/mohitsahu2409/blog-website.git
cd blog-website
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or whichever port Vite assigns).

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (id, name, email, password_hash, created_at);

-- Posts
CREATE TABLE posts (id, title, content, user_id, created_at);

-- Comments
CREATE TABLE comments (id, post_id, user_id, content, created_at  );
```

---

## 🧠 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| PostgreSQL SSL on Render | Configured `ssl: { rejectUnauthorized: false }` in the DB connection |
| Frontend + backend CORS | Set up proper CORS headers in Express with allowed origins |
| Mobile navbar bug | Fixed with Bootstrap's responsive collapse component |
| OpenAI quota errors | Added try/catch with a user-friendly fallback message |
| JWT persistence on refresh | Stored token in `localStorage` and rehydrated state on app load |

---

## 📈 Future Improvements

- [ ] Rich text editor (e.g., TipTap or Quill)
- [ ] Like / bookmark posts
- [ ] Search and filter posts by tag or keyword
- [ ] User profile pages with post history
- [ ] Dark mode toggle
- [ ] AI blog title generation
- [ ] AI comment moderation
- [ ] Pagination for posts feed

---

## 👨‍💻 Author

**Mohit Sahu**

[GitHub](https://github.com/mohitsahu2409)
[LinkedIn](https://www.linkedin.com/in/mohitsahu2409/)

---
