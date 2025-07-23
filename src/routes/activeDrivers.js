const express = require("express");
const router = express.Router();
const {
  getActiveDrivers,
  updateActiveDriver,
  getBusIdByDriverId,
  updateActiveDriverRoute
} = require("../controllers/activeDriversController");

router.get("/", getActiveDrivers);
router.post("/update", updateActiveDriver);
router.get("/:driverId", getBusIdByDriverId);
router.put("/updateRoute/:driver_id", updateActiveDriverRoute);

module.exports = router;
