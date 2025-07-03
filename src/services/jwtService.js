const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signToken = ({ payload, privateKey, options }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      privateKey || process.env.JWT_SECRET,
      options || { algorithm: "RS256" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const signAccessToken = (payload) => {
  return signToken({
    payload,
    options: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    },
  });
};

const signRefreshToken = (payload) => {
  return signToken({
    payload,
    options: {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "100d",
    },
  });
};

module.exports = {
  signToken,
  signAccessToken,
  signRefreshToken,
};
