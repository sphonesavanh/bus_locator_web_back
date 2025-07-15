const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const totalBuses = await pool.query("SELECT COUNT(*) FROM bus");
    const totalDrivers = await pool.query("SELECT COUNT(*) FROM driver");
    const totalLostItems = await pool.query("SELECT COUNT(*) FROM lost_and_found");

    res.json({
      totalBuses: parseInt(totalBuses.rows[0].count),
      totalDrivers: parseInt(totalDrivers.rows[0].count),
      totalLostItems: parseInt(totalLostItems.rows[0].count),
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;