const { sign } = require("jsonwebtoken");
const db = require("../../models");
const User = db.User;
const { hashPassword } = require("../utils/crypto");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} = require("./jwtService");

const register = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { fullName, phone, email, password, confirmPassword } = newUser;
    try {
      console.log(">> email: ", email);
      const existEmail = await User.findOne({ where: { email } });

      if (existEmail !== null) {
        reject({
          statusCode: 409,
          message: "Email already exists",
          error: "The provided email is already registered",
          data: null,
        });
      }

      const hashedPassword = hashPassword(password);
      const user = await User.create({
        full_name: fullName,
        phone: phone,
        email: email,
        password: hashedPassword,
        role_id: 2,
        active: true,
      });

      if (user) {
        resolve({
          statusCode: 201,
          message: "User registered successfully",
          error: null,
          data: user,
        });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "User registered fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const login = (user) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = user;
    try {
      const checkUser = await User.findOne({ where: { email } });

      if (checkUser === null) {
        reject({
          statusCode: 400,
          message: "User not found",
          error: "The provided email does not exist",
          data: null,
        });
      }

      const hashedPassword = hashPassword(password);
      if (checkUser.password !== hashedPassword) {
        reject({
          statusCode: 400,
          message: "Invalid password",
          error: "The provided password is incorrect",
          data: null,
        });
      }

      const accessToken = await signAccessToken({
        id: checkUser.id,
        role: checkUser.role_id,
      });

      const refreshToken = await signRefreshToken({
        id: checkUser.id,
        role: checkUser.role_id,
      });
      // luu refreshtoken vao db
      await User.update(
        { refresh_token: refreshToken },
        { where: { id: checkUser.id } }
      );

      resolve({
        status: "success",
        message: "Login successfully",
        error: null,
        data: {
          id: checkUser.id,
          full_name: checkUser.full_name,
          email: checkUser.email,
          phone: checkUser.phone,
          role: checkUser.role_id,
          avatar: checkUser.avatar,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Login fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const logout = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await User.update(
        { refresh_token: null },
        { where: { id: userId } }
      );
      if (updated[0] === 0) {
        return reject({
          statusCode: "400",
          message: "User not found",
          error: "The user does not exist or is already logged out",
          data: null,
        });
      }

      resolve({
        status: "success",
        message: "User logged out successfully",
        error: null,
        data: null,
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Logout fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const getMe = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return reject({
          statusCode: 404,
          message: "User not found",
          error: "The user does not exist",
          data: null,
        });
      }
      const {
        id,
        created_at,
        created_by,
        updated_at,
        updated_by,
        active,
        avatar,
        birthday,
        email,
        full_name,
        gender,
        phone,
        role_id,
      } = user;
      return resolve({
        status: "success",
        message: "Get me successfully",
        error: null,
        data: {
          id,
          created_at,
          created_by,
          updated_at,
          updated_by,
          active,
          avatar,
          birthday,
          email,
          full_name,
          gender,
          phone,
          role_id,
        },
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Get me fail",
        error: error.message,
        data: null,
      });
    }
  });
};

const refresh = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const decoded = await verifyToken(refreshToken);

      const user = await User.findOne({ where: { id: decoded.id } });
      if (!user || user.refresh_token !== refreshToken) {
        return reject({
          statusCode: 401,
          message: "Invalid refresh token",
          error: "The provided refresh token is invalid or expired",
          data: null,
        });
      }

      const newAccessToken = await signAccessToken({
        id: user.id,
        role: user.role_id,
      });

      return resolve({
        status: "success",
        message: "Refresh token successfully",
        error: null,
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      console.log(error);
      reject({
        status: "error",
        message: "Refresh fail",
        error: error.message,
        data: null,
      });
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  refresh,
};
