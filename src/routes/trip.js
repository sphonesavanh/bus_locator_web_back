const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.trip_id,
        TO_CHAR(t.start_time, 'HH24:MI') AS start_time,
        TO_CHAR(t.end_time, 'HH24:MI') AS end_time,
        r.route_id,
        r.route_name,
        b.bus_id,
        b.bus_plate
      FROM trip t
      JOIN route r ON t.route_id = r.route_id
      JOIN bus b ON t.bus_id = b.bus_id
      ORDER BY t.trip_id;
`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { route_id, bus_id, start_time, end_time } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO trip (route_id, bus_id, start_time, end_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [route_id, bus_id, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a trip using routeName and busPlate
router.put("/:id", async (req, res) => {
  const { route_id, bus_id, start_time, end_time } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE trip
       SET route_id = $1, bus_id = $2, start_time = $3, end_time = $4
       WHERE trip_id = $5`,
      [route_id, bus_id, start_time, end_time, id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a trip
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM trip WHERE trip_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
