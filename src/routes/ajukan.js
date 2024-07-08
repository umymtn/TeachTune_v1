const express = require("express");
const router = express.Router();

const { getMateri, getMapel, getIdAjar, getIdAjarByKelas, getAllMapel, getSemuaMateri } = require("../controllers/ajukan");

//READ - GET
router.get("/materi", getMateri);
router.get("/mapel", getMapel);
router.post("/ajarId", getIdAjar);
router.post("/ajarIdKelas", getIdAjarByKelas);
router.get("/all_mapel", getAllMapel);
router.get("/all_materi", getSemuaMateri);
module.exports = router;
