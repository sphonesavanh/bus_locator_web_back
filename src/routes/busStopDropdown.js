const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bus_stop_id AS id, bus_stop_name AS name 
       FROM bus_stop 
       ORDER BY bus_stop_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bus stops:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;