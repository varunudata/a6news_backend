const prisma = require("../prisma/client");
const slugify = require("slugify");

const createPost = async (req, res) => {
  try {
    const { title, subtitle, content, categoryId, tags, thumbnail, gallery } =
      req.body;
    if (!title || !content || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, Content, Category are required",
      });
    }
    const slug = slugify(title, { lower: true, strict: true });
    const existingSlug = await prisma.post.findUnique({ where: { slug } });
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "A post with that title already exists",
      });
    }
    const parsedTags =
      typeof tags === "string" && tags.trim().length > 0
        ? tags.split(",").map((t) => t.trim())
        : Array.isArray(tags)
        ? tags
        : [];
    const parsedGallery =
      typeof gallery === "string" && gallery.trim().length > 0
        ? gallery.split(",").map((g) => g.trim())
        : Array.isArray(gallery)
        ? gallery
        : [];
    const thumb =
      thumbnail && thumbnail !== "undefined" && thumbnail !== "null"
        ? thumbnail
        : null;

    const newPost = await prisma.post.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        content,
        categoryId: Number(categoryId),
        thumbnail: thumb,
        gallery: parsedGallery,
        tags: parsedTags,
      },
    });
    return res.status(200).json({
      success: true,
      message: "New post created successfully",
      data: newPost,
    });
  } catch (error) {
    console.log("Error in creating post :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in creating post",
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const categoryId = req.query.categoryId
      ? Number(req.query.categoryId)
      : null;
    const sort = req.query.sort === "oldest" ? "asc" : "desc";
    const skip = (page - 1) * limit;
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: sort },
      skip,
      take: limit,
      include: { category: true },
    });
    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / limit);
    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
      },
    });
  } catch (error) {
    console.log("Error in pagination:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching paginated posts",
    });
  }
};

const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug || slug === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid slug parameter",
      });
    }
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!post) {
      return res.status(404).json({ success: false, message: "No post found" });
    }
    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error in getting post by slug :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in getting post by slug",
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    console.log("Error in getting post by id :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in getting post by id",
    });
  }
};

const getLatestPostsPerCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const formatted = categories
      .map((c) =>
        c.posts.length > 0 ? { category: c.name, ...c.posts[0] } : null
      )
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.log("Error in latest-per-category :", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch latest posts per category",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, content, categoryId, tags, thumbnail, gallery } =
      req.body;
    const slug = title
      ? slugify(title, { lower: true, strict: true })
      : undefined;
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(subtitle !== undefined && { subtitle }),
        ...(content !== undefined && { content }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(gallery !== undefined && { gallery }),
        ...(tags !== undefined && { tags }),
      },
    });
    if (!updatedPost) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to update post" });
    }
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.log("Error in updating post :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in updating post",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.post.delete({ where: { id: Number(id) } });
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deleting posts :", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in deleting post",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  getPostById,
  getLatestPostsPerCategory,
  updatePost,
  deletePost,
};
