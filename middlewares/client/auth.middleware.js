// ** Model **
const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select(
    "-password"
  );
  if (!req.cookies.tokenUser || !user) {
    return res.redirect("/user/login");
  }

  res.locals.infoUser = user;

  next();
};
