const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          lost_id AS "lostId",
          user_id AS "finder", 
          '' AS phone, -- Placeholder, since there's no phone in this table
          status,
          CASE
            WHEN status = 'finished' THEN 'ทำสําเร็จຮອບທີ'
            WHEN status = 'pending' THEN 'ພັກພາຍ'
            ELSE 'ເລິກຮອບທີ'
          END AS status_label
        FROM lost_and_found
        ORDER BY found_date DESC;
      `);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
