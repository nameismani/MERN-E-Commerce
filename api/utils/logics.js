const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const hashPasswrod = async (Password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(Password, salt);
  return hash;
};

module.exports = {
  hashPasswrod,
};
