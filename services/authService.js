const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const { signToken } = require("../utils/jwt");

const registerUser = async (username, password) => {
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("Username already taken");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: hashedPassword,
      role: "user",
    },
  });
  return user;
};

const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error("Invalid username");
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }
  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });
  return { user, token };
};

module.exports = { registerUser, loginUser };
