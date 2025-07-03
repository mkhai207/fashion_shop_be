const User = require("../../models/User");
const { hashPassword } = require("../utils/crypto");

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

module.exports = {
  register,
};
