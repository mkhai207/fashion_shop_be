const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const registerResponse = await authService.register(req.body);
    return res.status(201).json(registerResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

module.exports = {
  register,
};
