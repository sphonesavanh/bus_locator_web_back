const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
            b.bus_id,
            b.bus_plate,
            b.bus_number,
            bt.bus_type_name,
            bt.bus_type_capacity,
            d.driver_name
        FROM bus b
        JOIN bus_type bt ON b.bus_type_id = bt.bus_type_id
        JOIN driver d ON b.driver_id = d.driver_id;`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
