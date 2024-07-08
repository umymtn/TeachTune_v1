const express = require("express");
const router = express.Router();
const { getDataGuru } = require("../controllers/data_guru");

router.get("/data-guru", getDataGuru);

module.exports = router;
