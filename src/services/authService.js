const { sign } = require("jsonwebtoken");
const User = require("../../models/User");
const { hashPassword } = require("../utils/crypto");
const { signAccessToken, signRefreshToken } = require("./jwtService");
const { check } = require("express-validator");

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

module.exports = {
  register,
  login,
};
