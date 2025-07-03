const crypto = require("crypto");

const sha256 = (content) => {
  return crypto.createHash("sha256").update(content).digest("hex");
};

const hashPassword = (password) => {
  return sha256(password);
};

module.exports = {
  sha256,
  hashPassword,
};
