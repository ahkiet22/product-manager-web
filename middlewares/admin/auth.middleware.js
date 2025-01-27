// ** Model **
const Account = require("../../models/account.model");

// ** Config **
const systemConfig = require("../../config/system");

module.exports.requireAuth = async (req, res, next) => {
  if (
    !req.cookies.token ||
    !(await Account.findOne({ token: req.cookies.token }))
  ) {
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
  next();
};
