const express = require("express");
const router = express.Router();
const { getJadwal } = require("../controllers/jadwal");

router.get("/jadwal", getJadwal);

module.exports = router;
