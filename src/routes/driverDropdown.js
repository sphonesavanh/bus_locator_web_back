const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Fetch only driver_id (or minimal info) for dropdown menus
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT driver_id, driver_name FROM driver ORDER BY driver_id`
    );
    res.json(result.rows); // e.g. [{ driver_id: 'DV001', driver_name: 'John' }]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  

module.exports = router;
