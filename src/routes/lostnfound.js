const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.post("/", async (req, res) => {
  const { route_id, bus_id, user_id, description, lost_date, status } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO lost_and_found (route_id, bus_id, user_id, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [route_id, bus_id, user_id, description, lost_date, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        lf.lost_id,
        r.route_name,
        b.bus_plate,
        u.user_name,
        u.user_email,
        u.user_tel,
        lf.description,
        lf.lost_date,
        lf.status
      FROM lost_and_found AS lf
      JOIN route r ON lf.route_id = r.route_id
      JOIN bus b ON lf.bus_id = b.bus_id
      JOIN users u ON lf.user_id = u.user_id
      ORDER BY lf.lost_id DESC;`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM lost_and_found WHERE lost_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lost item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { route_id, bus_id, user_id, description, lost_date, status } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE lost_and_found
       SET route_id = $1, bus_id = $2, user_id = $3, description = $4, lost_date = $5, status = $6
       WHERE lost_id = $7 RETURNING *`,
      [route_id, bus_id, user_id, description, lost_date, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lost item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM lost_and_found WHERE lost_id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lost item not found" });
    }
    res.json({ message: "Lost item deleted", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
