const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT route_id, coordinates from route_paths`
    );

    const features = result.rows
      .filter((r) => Array.isArray(r.coordinates))
      .map((r) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: r.coordinates,
      },
      properties: {
        route_id: r.route_id
      }
    }))

    res.json({
      type: "FeatureCollection",
      features: features,
    });
  } catch (err) {
    console.error("Error fetching route coordinates:", err.message);
    res.status(500).json({ error: "FAILED TO LOAD ROUTE DATA" });
  }
});

// get /api/route/:route_id
router.get(`/:route_id`, async (req, res) => {
  const { route_id } = req.params;

  try{
    const result = await pool.query(
      "SELECT coordinates FROM route_paths WHERE route_id = $1",
      [route_id]
    );

    if (result.rowCount === 0 || !Array.isArray(result.rows[0].coordinates)) {
      res.status(404).json({ error: `Route ${route_id} not found` });
    }

    return res.json({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: result.rows[0].coordinates,
      },
    });
  } catch (err) {
    console.error("Error fetching route coordinates:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
  
});

module.exports = router;
