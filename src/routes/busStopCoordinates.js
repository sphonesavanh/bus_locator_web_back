const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/:route_id/busstops", async(req, res) => {
  const { route_id } = req.params;

  try {
    const result = await pool.query(`
      SELECT bs.bus_stop_lat, bs.bus_stop_lng, bs.bus_stop_name
      FROM route_stop rs
      JOIN bus_stop bs ON rs.bus_stop_id = bs.bus_stop_id
      WHERE rs.route_id = $1
      ORDER BY rs.sequence ASC
    `, [route_id]);

    res.json(result.rows)
  } catch (err) {
    console.error("Error fetching bus stops:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;