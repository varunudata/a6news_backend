const prisma = require("../prisma/client");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Name cannot be empty" });
    }
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }
    const newCategory = await prisma.category.create({
      data: { name },
    });
    if (!newCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to create new category" });
    }
    return res.status(200).json({
      success: true,
      message: "New category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.log("Error in creating category :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in creating category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    console.log("Error in getting all catetgories :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in getting all categories",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const sort = req.query.sort === "oldest" ? "asc" : "desc";
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    console.log("PARAMS:", req.params);
    console.log("QUERY:", req.query);
    console.log("URL:", req.originalUrl);
    const posts = await prisma.post.findMany({
      where: { categoryId: id },
      skip,
      take: limit,
      orderBy: { createdAt: sort },
    });
    const totalPosts = await prisma.post.count({
      where: { categoryId: id },
    });
    return res.status(200).json({
      success: true,
      data: {
        category,
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
        },
      },
    });
  } catch (error) {
    console.log("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const catId = Number(req.params.id);
    const existing = await prisma.category.findUnique({
      where: { id: Number(catId) },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    await prisma.category.delete({ where: { id: catId } });
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error in deleting category :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in deleting category",
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
};
