const express = require("express");
const router = express.Router();
const { getTicker, updateTicker } = require("../controllers/tickerController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", getTicker);
router.put("/", authMiddleware, adminMiddleware, updateTicker);

module.exports = router;
