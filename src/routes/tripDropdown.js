const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
        `SELECT trip_id AS id FROM trip ORDER BY trip_id`
    )
    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching trips:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;