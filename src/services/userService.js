const db = require("../../models");
const buildQuery = require("../utils/queryBuilder");
const User = db.User;
const Role = db.Role;

const getAllUsers = (userRole, query) => {
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

      const result = await buildQuery(User, query, {
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
        allowedFilters: ["email", "full_name", "active", "gender"],
        allowedSorts: ["id", "email", "full_name", "created_at"],
        defaultSort: [["id", "DESC"]],
        defaultLimit: 20,
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["id", "code", "name"],
          },
        ],
      });

      resolve(result);
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

const getUserById = (userId, userRole) => {
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

      const user = await User.findOne({
        where: { id: userId },
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

      if (!user) {
        return reject({
          statusCode: 404,
          message: "User not found",
          error: "NOT_FOUND",
          data: null,
        });
      }

      return resolve({
        status: "success",
        message: "Get user successfully",
        error: null,
        data: {
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
        },
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get user fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const updateUserById = (userId, currentUser, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isAdmin = Number(currentUser.role) === 1;
      const isOwner = Number(currentUser.id) === Number(userId);

      if (!isAdmin && !isOwner) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to update this user",
          data: null,
        });
      }

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return reject({
          statusCode: 404,
          message: "User not found",
          error: "The user does not exist",
          data: null,
        });
      }

      const mappedData = {
        full_name: updateData.fullname,
        phone: updateData.phone,
        avatar: updateData.avatar,
        birthday: updateData.birthday,
        gender: updateData.gender,
        active: updateData.active,
      };

      const allowedFields = [
        "full_name",
        "phone",
        "avatar",
        "birthday",
        "gender",
        "active",
      ];

      allowedFields.forEach((field) => {
        if (mappedData[field] !== undefined) {
          user[field] = mappedData[field];
        }
      });
      await user.save();

      if (!user) {
        return reject({
          statusCode: 404,
          message: "User not found",
          error: "NOT_FOUND",
          data: null,
        });
      }

      const { password, refresh_token, ...sanitizedUser } = user.toJSON();
      return resolve({
        status: "success",
        message: "User updated successfully",
        error: null,
        data: sanitizedUser,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "User updated fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const deleteUserById = (userId, currentUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isAdmin = Number(currentUser.role) === 1;
      const isOwner = Number(currentUser.id) === Number(userId);

      if (!isAdmin && !isOwner) {
        return reject({
          statusCode: 403,
          message: "Forbidden",
          error: "You do not have permission to delete this user",
          data: null,
        });
      }

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return reject({
          statusCode: 404,
          message: "User not found",
          error: "The user does not exist",
          data: null,
        });
      }

      user.active = false;
      await user.save();

      return resolve({
        status: "success",
        message: "Delete user successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Delete user fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
