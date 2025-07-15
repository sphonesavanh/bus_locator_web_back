const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT bus_id AS id, bus_plate AS plate 
      FROM bus 
      ORDER BY bus_id`
    );
    res.json(result.rows); // e.g. [{ bus_id: 'B001', bus_plate: 'ABC123', bus_number: 'Bus 1' }]
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
