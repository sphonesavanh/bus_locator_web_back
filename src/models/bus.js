const pool = require("../db/database");

const getAllBuses = async () => {
  const query =
    "SELECT busId, busPlate, busBrand, driverId, routeId FROM buses";
  const { rows } = await pool.query(query);
  return rows;
};

module.exports = {
  getAllBuses,
};
