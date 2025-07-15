const express = require("express");
const router = express.Router();
const pool = require("../db/database");

// Example if calling external PHP API
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM bus_stop ORDER BY bus_stop_id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bus stops:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { name, lat, lng } = req.body;
  console.log("Received: ", req.body);

  try {
    const result = await pool.query(
      "INSERT INTO bus_stop (bus_stop_name, bus_stop_lat, bus_stop_lng) VALUES ($1, $2, $3) RETURNING *",
      [name, lat, lng]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Insert failed:", err); // helpful for debugging
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { name, lat, lng } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      "UPDATE bus_stop SET bus_stop_name = $1, bus_stop_lat = $2, bus_stop_lng = $3 WHERE bus_stop_id = $4",
      [name, lat, lng, id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bus_stop WHERE bus_stop_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
