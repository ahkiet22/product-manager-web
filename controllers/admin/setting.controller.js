const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const generalSetting = await SettingGeneral.find();
  console.log(generalSetting);
  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    generalSetting: generalSetting,
  });
};

// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  // const settingGeneral = new SettingGeneral(req.body);
  // await settingGeneral.save();
  // res.redirect("back");
  res.send("OK")
};
