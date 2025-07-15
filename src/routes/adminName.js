const express = require("express");
const router = express.Router();
const pool = require("../db/database");

router.get("/admin/profile", (req, res) => {
  const adminId = req.session?.adminId || req.user?.id;

  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  pool.query(
    "SELECT admin_username FROM admins WHERE admin_id = $1",
    [adminId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (result.rows.length === 0)
        return res.status(404).json({ error: "Admin not found" });

      res.json({ username: result.rows[0].username });
    }
  );
});

module.exports = router;