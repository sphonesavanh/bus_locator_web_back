const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Read
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        s.schedule_id, 
        LPAD(REGEXP_REPLACE(s.trip_id, '\\D', '', 'g'), 3, '0') AS trip_id, 
        bs.bus_stop_id,
        bs.bus_stop_name, 
        TO_CHAR(s.planned_arrival, 'HH24:MI') AS planned_arrival, 
        TO_CHAR(s.planned_department, 'HH24:MI') AS planned_department 
      FROM trip_schedule s
      JOIN bus_stop bs ON s.bus_stop_id = bs.bus_stop_id
      ORDER BY schedule_id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/", async (req, res) => {
  const {
    trip_id,
    bus_stop_id,
    planned_arrival,
    planned_department,
  } = req.body;

  console.log("Received schedule POST:", req.body); // debug

  try {
    const result = await pool.query(
      `INSERT INTO trip_schedule (trip_id, bus_stop_id, planned_arrival, planned_department)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [trip_id, bus_stop_id, planned_arrival, planned_department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Update
router.put("/:id", async (req, res) => {
  const { trip_id, bus_stop_id, planned_arrival, planned_department } =
    req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE trip_schedule 
       SET trip_id = $1, bus_stop_id = $2, planned_arrival = $3, planned_department = $4 
       WHERE schedule_id = $5 RETURNING *`,
      [trip_id, bus_stop_id, planned_arrival, planned_department, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM trip_schedule WHERE schedule_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.json({ message: "Schedule deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;