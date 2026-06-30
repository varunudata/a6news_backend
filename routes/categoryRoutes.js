const router = require("express").Router();

const {
  createCategory,
  getAllCategories,
  deleteCategory,
  getCategoryById,
  reorderCategories,
} = require("../controllers/categoryController");

const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);
router.put("/reorder", authMiddleware, adminMiddleware, reorderCategories);

module.exports = router;
