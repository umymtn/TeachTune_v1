const express = require("express");
const router = express.Router();
const { postRecommendations } = require("../controllers/ai");

router.post("/recommendations", postRecommendations);

module.exports = router;
