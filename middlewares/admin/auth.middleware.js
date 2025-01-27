// ** Model **
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

// ** Config **
const systemConfig = require("../../config/system");
const { use } = require("../../routes/admin/dashboard.route");

module.exports.requireAuth = async (req, res, next) => {
  const user = await Account.findOne({ token: req.cookies.token }).select(
    "-password"
  );
  if (!req.cookies.token || !user) {
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  }
  const role = await Role.findOne({
    _id: user.role_id,
  }).select("title permissions");
  res.locals.user = user;
  res.locals.role = role;

  next();
};
