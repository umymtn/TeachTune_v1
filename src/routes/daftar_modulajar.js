const express = require("express");
const router = express.Router();
const ModulAjarController = require("../controllers/daftar_modulajar");

router.get("/modul_ajar", ModulAjarController.getModulAjarbyNIP);
router.get("/allmodul", ModulAjarController.getAll);
router.get("/d_waka/verifikasi", ModulAjarController.getModulWaka);
router.get("/validasi", ModulAjarController.getModulKepsek);
router.get("/verifikasi", ModulAjarController.getModulWaka);

module.exports = router;
