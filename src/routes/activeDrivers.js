const express = require("express");
const router = express.Router();
const {
  getActiveDrivers,
  updateActiveDriver,
  getBusIdByDriverId,
} = require("../controllers/activeDriversController");

router.get("/", getActiveDrivers);
router.post("/update", updateActiveDriver);
router.get("/:driverId", getBusIdByDriverId);

module.exports = router;
