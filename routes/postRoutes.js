const router = require("express").Router();

const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getPostById,
  getLatestPostsPerCategory,
} = require("../controllers/postController");

const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/latest-per-category", getLatestPostsPerCategory);
router.get("/id/:id", getPostById);
router.get("/:slug", getPostBySlug);
router.put("/:id", authMiddleware, adminMiddleware, updatePost);
router.delete("/:id", authMiddleware, adminMiddleware, deletePost);

module.exports = router;
