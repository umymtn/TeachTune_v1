const express = require("express");
const router = express.Router();

const { getAllSiswa, getAllGuru, getAllValidates, getAllNotValidates } = require("../controllers/total");

router.get("/totalsiswa", getAllSiswa);
router.get("/totalguru", getAllGuru);
router.get("/totaltervalidasi", getAllValidates);
router.get("/totalbelumvalidasi", getAllNotValidates);

module.exports = router;
