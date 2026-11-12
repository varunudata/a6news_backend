const router = require("express").Router();
const { login, register, getAllUsers } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
