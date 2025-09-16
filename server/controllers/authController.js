import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

export async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: result.rows[0].id, name: result.rows[0].name },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}



// {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik1vaGl0IiwiaWF0IjoxNzU0MjkzMTQzfQ.TZg-Rslrjuhnj9Yeigi_yEeBO4ADD74ZngTEhPwl4r8"}
