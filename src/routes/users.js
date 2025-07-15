const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// READ all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY user_id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { name, email, tel, password } = req.body; // match incoming data
  console.log("Received: ", req.body);

  try {
    const result = await pool.query(
      "INSERT INTO users (user_name, user_email, user_tel, user_password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, tel, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Insert failed:", err); // helpful for debugging
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
router.put("/:id", async (req, res) => {
  const { name, email, tel } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE users SET user_name = $1, user_email = $2, user_tel = $3 WHERE user_id = $4",
      [name, email, tel, id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
