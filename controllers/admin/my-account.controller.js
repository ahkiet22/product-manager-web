const Account = require("../../models/account.model");
const hash = require("../../services/hashPassword")

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  const emailExits = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });
  if (!emailExits) {
    try {
      if (req.body.password) {
        req.body.password = await hash.hashPassword(req.body.password);
      } else {
        delete req.body.password;
      }
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật thành công");
    } catch (error) {
      console.error("ERROR", error);
    }
  } else {
    req.flash("error", "Email này đã tồn tại!");
  }
  res.redirect("back");
};
