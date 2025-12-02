const router = require("express").Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
  getCategoryById,
} = require("../controllers/categoryController");

const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
