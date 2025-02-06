const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
    status: "active",
  }).select("-password");
  if (!req.cookies.tokenUser || !user) {
    return res.redirect("/user/login");
  }
  res.locals.user = user;

  next();
};
