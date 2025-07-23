const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM route ORDER BY route_id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { id, name } = req.body;
  console.log("Received: ", req.body);
  try {
    const result = await pool.query(
      "INSERT INTO route (route_id, route_name) VALUES ($1, $2) RETURNING *",
      [id, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE
router.put("/:id", async (req, res) => {
  const { id: newId, name } = req.body;
  const { id: oldId } = req.params;
  try {
    await pool.query(
      "UPDATE route SET route_id = $1, route_name = $2 WHERE route_id = $3",
      [newId, name, oldId]
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
    await pool.query("DELETE FROM route WHERE route_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
