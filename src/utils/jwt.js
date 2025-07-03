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

module.exports = {
  signToken,
};
