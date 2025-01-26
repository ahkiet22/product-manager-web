module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }

  if (!req.body.password || req.body.password.length < 6) {
    const errorMessage = !req.body.password
      ? "Vui lòng nhập mật khẩu!"
      : "Vui lòng nhập mật khẩu dài ít nhất 6 kí tự!";
    req.flash("error", errorMessage);
    res.redirect("back");
    return;
  }

  if (
    !req.body.phone ||
    !/^(03|05|07|08|09|01[2|6|8|9])\d{8}$/.test(req.body.phone)
  ) {
    const errorMessage = !req.body.phone
      ? "Vui lòng nhập số điện thoại!"
      : "Vui lòng nhập số điện thoại hợp lệ!";
    req.flash("error", errorMessage);
    res.redirect("back");
    return;
  }
  next();
};

module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }

  // if (!req.body.password || req.body.password.length < 6) {
  //   const errorMessage = !req.body.password
  //     ? "Vui lòng nhập mật khẩu!"
  //     : "Vui lòng nhập mật khẩu dài ít nhất 6 kí tự!";
  //   req.flash("error", errorMessage);
  //   res.redirect("back");
  //   return;
  // }

  if (
    !req.body.phone ||
    !/^(03|05|07|08|09|01[2|6|8|9])\d{8}$/.test(req.body.phone)
  ) {
    const errorMessage = !req.body.phone
      ? "Vui lòng nhập số điện thoại!"
      : "Vui lòng nhập số điện thoại hợp lệ!";
    req.flash("error", errorMessage);
    res.redirect("back");
    return;
  }
  next();
};

