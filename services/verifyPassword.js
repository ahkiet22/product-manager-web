const bcrypt = require("bcrypt");

module.exports.verifyPassword = async (password) => {
  const checkPassword = await bcrypt.compare(inputPassword, password);
  return checkPassword;
};
