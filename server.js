const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PORT = process.env.PORT || 4004;
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const postRoutes = require("./routes/postRoutes");

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

app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
