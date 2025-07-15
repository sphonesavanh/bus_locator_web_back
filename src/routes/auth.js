// routes/auth.js
const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM admins WHERE admin_username = $1 AND admin_password = $2';
    const values = [username, password];

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
        res.status(200).json({ message: "Login successful", user: result.rows[0] });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
