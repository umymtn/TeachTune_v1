const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.NIP || req.session.Jabatan !== "KEPSEK") {
    return res.status(401).send("Access denied");
  }
  res.sendFile(path.join(__dirname, "../../public/d_kepsek.html")); // Serve KEPSEK page
});

module.exports = router;
