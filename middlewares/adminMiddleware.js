const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No user data found" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(401)
      .json({ success: false, message: "Access only for admin" });
  }
  next();
};

module.exports = adminMiddleware;
