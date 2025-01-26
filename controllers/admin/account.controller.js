// Model
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

// ** Config **
const systemConfig = require("../../config/system");

const hash = require("../../services/hashPassword");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Thêm tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!emailExits) {
    try {
      req.body.password = await hash.hashPassword(req.body.password);
      const records = new Account(req.body);
      await records.save();
      req.flash("success", "Tạo tài khoản thành công");
    } catch (error) {
      console.error("ERROR", error);
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } else {
    req.flash("error", "Email này đã tồn tại!");
    res.redirect("back");
  }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };
  try {
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
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
