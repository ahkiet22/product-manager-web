const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const hash = require("../../services/hashPassword");
const verify = require("../../services/verifyPassword");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

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
  const otp = generateHelper.generateRandomSNumber(6);
  // Lưu thông tin vào DB
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  sendMailHelper.sendMail(email, subject, user, otp);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  let otp = "";
  for (let i of [1, 2, 3, 4, 5, 6]) {
    const index = `otp${i}`;
    otp += req.body[index];
  }
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  // Lưu cookie trên httpOnly
  const oneDay = 24 * 60 * 60 * 1000;
  res.cookie("tokenUser", user.tokenUser, {
    httpOnly: true,
    maxAge: oneDay,
    secure: true,
    sameSite: "strict",
  });

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = await hash.hashPassword(req.body.newPassword);
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: password,
    }
  );
  res.redirect("/");
};
