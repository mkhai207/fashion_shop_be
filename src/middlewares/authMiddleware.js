const { verifyToken } = require("../services/jwtService");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
      error: "Authorization token is required",
      data: null,
    });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
      error: error.message,
      data: null,
    });
  }
};

module.exports = authMiddleware;
