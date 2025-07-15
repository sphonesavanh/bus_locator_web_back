const pool = require("../db/database");

// Get all buses
const getAllBuses = async (req, res) => {
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
    console.error("Error fetching buses:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllBuses };
