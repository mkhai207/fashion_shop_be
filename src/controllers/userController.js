const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  try {
    const getAllUsersResponse = await userService.getAllUsers(req.user.role);
    return res.status(200).json(getAllUsersResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const getUserByIdResponse = await userService.getUserById(
      req.params.id,
      req.user.role
    );
    return res.status(200).json(getUserByIdResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updateUserResponse = await userService.updateUserById(
      req.params.id,
      req.user,
      req.body
    );
    return res.status(200).json(updateUserResponse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message,
      error: error.error,
      data: null,
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const deleteUserResponse = await userService.deleteUserById(
      req.params.id,
      req.user
    );
    return res.status(200).json(deleteUserResponse);
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
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
