const express = require("express");
const router = express.Router();
const { generateImpact } = require("../controllers/impactController");

router.post("/impact", generateImpact);

module.exports = router;