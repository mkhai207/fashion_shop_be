const { verifyRefreshToken } = require("../services/jwtService");

const refreshTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No refresh token provided",
    });
  }

  try {
    const decoded = await verifyRefreshToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Invalid refresh token",
      error: error.message,
    });
  }
};

module.exports = refreshTokenMiddleware;
