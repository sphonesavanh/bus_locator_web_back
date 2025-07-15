const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("../bus-tracking-system-webback/src/routes/auth");
const bus = require("../bus-tracking-system-webback/src/routes/bus");
const busStopsRoutes = require("../bus-tracking-system-webback/src/routes/busStops");
const busRoutes = require("../bus-tracking-system-webback/src/routes/busRoutes");
const userRoutes = require("../bus-tracking-system-webback/src/routes/users");
const driverRoutes = require("../bus-tracking-system-webback/src/routes/driver");
const lostandfoundRoutes = require("../bus-tracking-system-webback/src/routes/lostnfound");
const driverDropdownRoutes = require("../bus-tracking-system-webback/src/routes/driverDropdown");
const busTypeRoutes = require("../bus-tracking-system-webback/src/routes/busType");
const busTypeDropdownRoutes = require("../bus-tracking-system-webback/src/routes/busTypeDropdown");
const tripRoutes = require("../bus-tracking-system-webback/src/routes/trip");
const scheduleRoutes = require("../bus-tracking-system-webback/src/routes/schedule");
const dashboardRoutes = require("../bus-tracking-system-webback/src/routes/dashboard");
const busDashRoutes = require("../bus-tracking-system-webback/src/routes/busDash");
const driverDashRoutes = require("../bus-tracking-system-webback/src/routes/driverDash");
const lostDashRoutes = require("../bus-tracking-system-webback/src/routes/lostDash");
const adminNameRoutes = require("../bus-tracking-system-webback/src/routes/adminName");

const trackingRoutes = require("../bus-tracking-system-webback/src/routes/tracking");
const routeRoutes = require("./src/routes/routeCoordinates");
const busStopPathRoutes = require("../bus-tracking-system-webback/src/routes/busStopCoordinates");

const busDropdownRoutes = require("../bus-tracking-system-webback/src/routes/busDropdown");
const routeDropdownRoutes = require("../bus-tracking-system-webback/src/routes/routeDropdown");
const tripDropdownRoutes = require("../bus-tracking-system-webback/src/routes/tripDropdown");
const busStopDropdownRoutes = require("../bus-tracking-system-webback/src/routes/busStopDropdown");
const lostAndFoundDropdownRoutes = require("../bus-tracking-system-webback/src/routes/lostnfoundDropdown");

const activeDriverRoutes = require("../bus-tracking-system-webback/src/routes/activeDrivers");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/bus", bus);
app.use("/api/busstops", busStopsRoutes);
app.use("/api/busroutes", busRoutes);
app.use("/api/bustype", busTypeRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/lost-and-found", lostandfoundRoutes);
app.use("/api/driver-dropdown", driverDropdownRoutes);
app.use("/api/bustype-dropdown", busTypeDropdownRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/busDash", busDashRoutes);
app.use("/api/driverDash", driverDashRoutes);
app.use("/api/lostDash", lostDashRoutes);
app.use("/api", adminNameRoutes);

app.use("/api/tracking", trackingRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/bus-stop", busStopPathRoutes);

app.use("/api/bus-dropdown", busDropdownRoutes);
app.use("/api/route-dropdown", routeDropdownRoutes);
app.use("/api/trip-dropdown", tripDropdownRoutes);
app.use("/api/bus-stop-dropdown", busStopDropdownRoutes);
app.use("/api/lost-and-found-dropdown", lostAndFoundDropdownRoutes);

app.use("/api/active-drivers", activeDriverRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Bus Tracking System");
});

app.listen(PORT, "0.0.0.0", () => {
  const os = require("os");
  const interfaces = os.networkInterfaces();

  console.log(`Server running on these IPs:`);
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`http://${iface.address}:${PORT}`);
      }
    }
  }
});
