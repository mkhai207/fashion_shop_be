const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signToken = ({ payload, privateKey, options }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      privateKey || process.env.JWT_SECRET,
      options || { algorithm: "HS256" },
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

const verifyToken = (token, publicKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey || process.env.JWT_SECRET,
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
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

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

module.exports = {
  signToken,
  verifyToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
