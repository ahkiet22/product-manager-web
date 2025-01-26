const bcrypt = require("bcrypt");

module.exports.verifyPassword = async (inputPassword, password) => {
  const checkPassword = await bcrypt.compare(inputPassword, password);
  return checkPassword;
};
