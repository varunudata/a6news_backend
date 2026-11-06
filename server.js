require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PORT = process.env.PORT || 10000;

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const postRoutes = require("./routes/postRoutes");
const tickerRoutes = require("./routes/tickerRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(upload.none());

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ticker", tickerRoutes);

// Protected health/test route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ success: true, message: `Hello ${req.user.username}, you are authorized!` });
});
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ success: true, message: `Hello ${req.user.username}, you are authorized!` });
});

app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
