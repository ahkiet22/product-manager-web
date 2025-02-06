const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const hash = require("../../services/hashPassword");
const verify = require("../../services/verifyPassword");
const generateHelper = require("../../helpers/generate");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
    });
    if (existEmail) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect("back");
      return;
    }
    req.body.password = await hash.hashPassword(req.body.password);
    const user = new User(req.body);
    await user.save();

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie("tokenUser", user.tokenUser, {
      httpOnly: true,
      maxAge: oneDay,
      secure: true,
      sameSite: "strict",
    });
    res.redirect("/");
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    req.flash("error", "Đã xảy ra lỗi, vui lòng thử lại!");
    res.redirect("back");
  }
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!user) {
      req.flash("error", "Email không tồn tại!");
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
    // Lưu cookie trên httpOnly
    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie("tokenUser", user.tokenUser, {
      httpOnly: true,
      maxAge: oneDay,
      secure: true,
      sameSite: "strict",
    });
    res.redirect("/");
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    req.flash("error", "Đã xảy ra lỗi, vui lòng thử lại!");
    res.redirect("back");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  const otp = generateHelper.generateRandomSNumber(8);
  // Lưu thông tin vào DB
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // Nếu tồn tại email thì gửi mã OTP qua email
  res.send("OK");
};
