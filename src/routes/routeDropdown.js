const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
        `SELECT route_id AS id, route_name AS name 
        FROM route 
        ORDER BY route_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching routes:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;