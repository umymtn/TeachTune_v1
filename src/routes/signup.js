const express = require("express");
const router = express.Router();

const signupcontroller = require("../controllers/signup");

//CREATE - POST
router.post("/", signupcontroller.createNewGuru);

module.exports = router;
