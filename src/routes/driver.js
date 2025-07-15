const express = require('express');
const router = express.Router();
const pool = require('../db/database');

// READ all drivers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM driver ORDER BY driver_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new driver
router.post('/', async (req, res) => {
  const { name, tel, password, status } = req.body; // match incoming data
  console.log('Received: ', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO driver (driver_name, driver_phone, driver_password, driver_status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, tel, password, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert failed:', err); // helpful for debugging
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a driver
router.put('/:id', async (req, res) => {
  const { name, tel, status } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      'UPDATE driver SET driver_name = $1, driver_phone = $2, driver_status = $3 WHERE driver_id = $4',
      [name, tel, status, id]
    );
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a driver
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM driver WHERE driver_id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;