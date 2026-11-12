const { registerUser, loginUser } = require("../services/authService");
const prisma = require("../prisma/client");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username and password required" });
    const user = await registerUser(username, password);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ success: false, message: "Username and password required" });
    const { user, token } = await loginUser(username, password);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true },
      orderBy: { id: "asc" },
    });
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

module.exports = { register, login, getAllUsers };
