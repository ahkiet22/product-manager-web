const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const generalSetting = await SettingGeneral.findOne();
  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    generalSetting: generalSetting,
  });
};

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  try {
    let generalSetting = await SettingGeneral.findOne({});

    if (generalSetting) {
      await generalSetting.updateOne(req.body);
      req.flash("success", "Cập nhật thành công!");
    } else {
      generalSetting = new SettingGeneral(req.body);
      await generalSetting.save();
    }
    res.redirect("/admin/settings/general");
  } catch (error) {
    console.error(error);
    req.flash("error", "Có lỗi xảy ra!");
    res.redirect("back");
  }
};
