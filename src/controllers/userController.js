const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  try {
    console.log(">> userRole: ", req.user.role);
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
module.exports = {
  getAllUsers,
};
