const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// READ all buses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.bus_id, b.bus_plate, b.bus_number,
        b.bus_type_id, bt.bus_type_name, bt.bus_type_capacity,
        b.driver_id, d.driver_name, d.driver_phone
      FROM bus b
      LEFT JOIN bus_type bt ON b.bus_type_id = bt.bus_type_id
      LEFT JOIN driver d ON b.driver_id = d.driver_id
      ORDER BY b.bus_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new bus
router.post("/", async (req, res) => {
  const { plate, number, busTypeId, driverId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bus (bus_plate, bus_number, bus_type_id, driver_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [plate, number, busTypeId, driverId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE only bus_plate and bus_number
router.put("/:id", async (req, res) => {
  const { plate, number, busTypeId, driverId } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE bus 
       SET bus_plate = $1, bus_number = $2, bus_type_id = $3, driver_id = $4 
       WHERE bus_id = $5`,
      [plate, number, busTypeId, driverId, id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE a bus
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM bus WHERE bus_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
