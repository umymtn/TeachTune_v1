// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/multer");
// const { updateModulAjarControl, deleteModulAjarHandler, getModulAjarHandler } = require("../controllers/modul_ajar");

// router.post("/update-modul-ajar", upload.single("file"), updateModulAjarControl);
// router.delete("/modul_ajar/:id_modul_ajar", deleteModulAjarHandler);
// router.get("/modul_ajar/:id_modul_ajar", getModulAjarHandler);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { updateModulAjarControl, deleteModulAjarHandler, getModulAjarHandler } = require("../controllers/modul_ajar");

router.post("/update-modul-ajar", upload.single("file"), updateModulAjarControl);
router.delete("/modul_ajar/:id_modul_ajar", deleteModulAjarHandler);
router.get("/modul_ajar/:id_modul_ajar", getModulAjarHandler);

module.exports = router;
