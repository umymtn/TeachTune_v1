const express = require("express");
const router = express.Router();
const { getStatistikControl, getProgresControl } = require("../controllers/kemajuan");

router.get("/trend-kemajuan", getStatistikControl);
router.get("/progres", getProgresControl);

module.exports = router;
