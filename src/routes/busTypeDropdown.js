const express = require('express');
const router = express.Router();
const pool = require('../db/database');

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT bus_type_id AS id, bus_type_name AS name 
        FROM bus_type 
        ORDER BY bus_type_id
      `);
    res.json(result.rows); // e.g., [{ id: 'BT001', name: 'Minivan' }]
  } catch (err) {
    console.error("Error fetching bus types:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;