const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// READ all bus types
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bus_type ORDER BY bus_type_id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ a specific bus type by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM bus_type WHERE bus_type_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bus type not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new bus type
router.post("/", async (req, res) => {
  const { bus_type_id, bus_type_name, bus_type_capacity } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bus_type (bus_type_name, bus_type_capacity) VALUES ($1, $2) RETURNING *",
      [bus_type_name, bus_type_capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a bus type
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bus_type_name, bus_type_capacity } = req.body;
  try {
    const result = await pool.query(
      "UPDATE bus_type SET bus_type_name = $1, bus_type_capacity = $2 WHERE bus_type_id = $3 RETURNING *",
      [bus_type_name, bus_type_capacity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bus type not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a bus type
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM bus_type WHERE bus_type_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bus type not found" });
    }
    res.json({ message: "Bus type deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
