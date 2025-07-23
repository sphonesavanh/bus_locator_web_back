const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Update tracking status for a trip
router.put("/update/:trip_id", async (req, res) => {
  const { trip_id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tracking 
       SET status = $1,
           timestamp = NOW() 
       WHERE trip_id = $2
       RETURNING *`,
      [status, trip_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tracking not found" });
    }

    const normalized = status.trim().toLowerCase();
    // Set trip end_time when bus reaches final destination
    if (normalized === "final_destination") {
      const endResult = await pool.query(
        `UPDATE trip
         SET end_time = NOW()
         WHERE trip_id = $1
         RETURNING *`,
        [trip_id]
      );
      console.log(`End time set for trip ${trip_id}:`, endResult.rows[0]);
    }

    res.status(200).json({ message: "Tracking status updated" });
  } catch (err) {
    console.error("Error in PUT /update/:trip_id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all tracking records
router.get("/status", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.tracking_id, t.trip_id, t.timestamp, t.status,
             tr.route_id, tr.bus_id,
             b.bus_plate, b.bus_number,
             r.route_name
      FROM tracking t
      JOIN trip tr ON t.trip_id = tr.trip_id
      JOIN bus b ON tr.bus_id = b.bus_id
      JOIN route r ON tr.route_id = r.route_id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in GET /status:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get latest status for a trip
router.get("/:trip_id", async (req, res) => {
  const { trip_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         t.tracking_id, 
         t.trip_id, 
         t.timestamp, 
         t.status,
         tr.route_id
       FROM tracking t
       JOIN trip tr ON t.trip_id = tr.trip_id
       WHERE t.trip_id = $1
       ORDER BY t.tracking_id DESC
       LIMIT 1`,
      [trip_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Trip ${trip_id} not found` });
    }

    console.log("Tracking response:", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error in GET /:trip_id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get current active trip for a bus
router.get("/current/:bus_id", async (req, res) => {
  const { bus_id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT tr.trip_id, tr.route_id
       FROM trip tr
       JOIN tracking t ON tr.trip_id = t.trip_id
       WHERE tr.bus_id = $1
         AND tr.end_time IS NULL
       ORDER BY t.tracking_id DESC
       LIMIT 1`,
      [bus_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No active trip" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in GET /current/:bus_id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all active trips with their latest tracking status
router.get("/allbus/active", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        tr.trip_id,
        tr.route_id,
        tr.bus_id,
        t.status,
        t.timestamp
      FROM trip tr
      LEFT JOIN tracking t ON t.trip_id = tr.trip_id
      WHERE tr.end_time IS NULL
      AND (t.tracking_id IS NULL OR t.tracking_id IN (
      SELECT MAX(tracking_id) FROM tracking GROUP BY trip_id
    ));
    `
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error in GET /active:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
