const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session.NIP || req.session.Jabatan !== "WAKA AKADEMIK") {
    return res.status(401).send("Access denied");
  }
  res.sendFile(path.join(__dirname, "../../public/d_waka.html")); // Serve WAKA AKADEMIK page
});

module.exports = router;
