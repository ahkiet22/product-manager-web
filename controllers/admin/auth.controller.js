// ** Model **
const Account = require("../../models/account.model");

// ** Service **
const verify = require("../../services/verifyPassword");

// ** Config **
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Đăng nhập",
  });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email này không tồn tại!");
    res.redirect("back");
    return;
  }
  const checkPassword = await verify.verifyPassword(password, user.password);
  if (!checkPassword) {
    req.flash("error", "sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("token", user.token, {
    httpOnly: true,
    maxAge: oneDay,
    secure: true,
    sameSite: "strict",
  });
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
