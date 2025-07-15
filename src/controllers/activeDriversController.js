const pool = require("../db/database");
const { get } = require("../routes/auth");

const getActiveDrivers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ad.driver_id, 
        d.driver_name,
        ad.bus_id, 
        ad.route_id, 
        ad.trip_id
      FROM active_drivers ad
      JOIN driver d ON ad.driver_id = d.driver_id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateActiveDriver = async (req, res) => {
  const { driver_id, bus_id, route_id, trip_id } = req.body;
  try {
    await pool.query(
      `
        INSERT INTO active_drivers (driver_id, bus_id, route_id, trip_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (driver_id) DO UPDATE SET bus_id = $2, route_id = $3, trip_id = $4
        `,
      [driver_id, bus_id, route_id, trip_id]
    );
    res.json({ message: "Active driver updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBusIdByDriverId = async (req, res) => {
  const { driverId } = req.params;
  try {
    const result = await pool.query(
      "SELECT bus_id FROM active_drivers WHERE driver_id = $1",
      [driverId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getActiveDrivers,
  updateActiveDriver,
  getBusIdByDriverId
};
