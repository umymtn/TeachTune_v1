const express = require("express");
const router = express.Router();
const { getNilaiStatistik, getKelasByNIP, addOrUpdateProgres, getAllKelas } = require("../controllers/progres");
const { getTingkatData, getAllProgressData } = require("../controllers/progres");

router.get("/distinct_tingkat", getTingkatData);
router.get("/progress", getAllProgressData);
router.get("/nilai/:id_rk", getNilaiStatistik); // Use a dynamic parameter for GET request
router.get("/kelas", getKelasByNIP);
router.get("/all_kelas", getAllKelas);

// Rute untuk menambahkan atau memperbarui progres
router.post("/progres", addOrUpdateProgres);

module.exports = router;
