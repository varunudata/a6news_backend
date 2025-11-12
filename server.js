const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const PORT = 4004;

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, passwordHash },
    });
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`User Name : ${username} | Password: ${password}`);
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Username" });
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect Password" });
  }
  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "2hr" }
  );
  return res.json({ success: true, message: "Login Successful", token });
});

app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      message: `Welcome ${decoded.username} ! This is protected data!`,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
});

app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
