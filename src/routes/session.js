const express = require("express");
const router = express.Router();

router.get("/api/session", (req, res) => {
  if (req.session && req.session.Jabatan) {
    res.json({
      Jabatan: req.session.Jabatan,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
