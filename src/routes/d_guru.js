const express = require("express");
const router = express.Router();

const d_gurucontroller = require("../controllers/d_guru");

//CREATE - POST
router.post("/", d_gurucontroller.createNewGuru);

//READ - GET
router.get("/dataguru", d_gurucontroller.getAllGuru);

//UPDATE - PATCH
router.patch("/:NIP", d_gurucontroller.updateGuru);

module.exports = router;
