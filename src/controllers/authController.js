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

const login = async (req, res) => {
  try {
    const loginResponse = await authService.login(req.body);
    return res.status(200).json(loginResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(">> userId: ", userId);
    const logoutResponse = await authService.logout(userId);
    return res.status(200).json(logoutResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const getMeResponse = await authService.getMe(userId);
    return res.status(200).json(getMeResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    const refreshResponse = await authService.refresh(refreshToken);
    return res.status(200).json(refreshResponse);
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
  login,
  logout,
  getMe,
  refresh,
};
