const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { addModulAjar } = require("../controllers/add_modulajar");

router.post("/ajukan", upload.single("file"), addModulAjar);

module.exports = router;
