const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/route", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT route_id, route_name FROM route ORDER BY route_id ASC"
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving route list:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bus", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT bus_id, bus_plate FROM bus ORDER BY bus_id"
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, user_name FROM users ORDER BY user_id"
    );
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
