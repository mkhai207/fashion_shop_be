const db = require("../../models");
const User = db.User;
const Role = db.Role;

const getAllUsers = (userRole) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Number(userRole) !== 1) {
        return reject({
          statusCode: 403,
          message: "Unauthorized",
          error: "UNAUTHORIZED",
          data: null,
        });
      }

      const users = await User.findAll({
        attributes: [
          "id",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by",
          "active",
          "avatar",
          "birthday",
          "email",
          "full_name",
          "gender",
          "phone",
        ],
        include: [
          { model: Role, as: "role", attributes: ["id", "code", "name"] },
        ],
      });

      return resolve({
        status: "success",
        message: "Get users successfully",
        error: null,
        data: users.map((user) => ({
          id: user.id,
          created_at: user.created_at,
          created_by: user.created_by,
          updated_at: user.updated_at,
          updated_by: user.updated_by,
          avatar: user.avatar,
          birthday: user.birthday,
          email: user.email,
          full_name: user.full_name,
          gender: user.gender,
          phone: user.phone,
          active: user.active,
          role: user.role,
        })),
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get users fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  getAllUsers,
};
