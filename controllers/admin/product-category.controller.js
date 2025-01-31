const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find);

  const newRecords = createTreeHelper.createTree(record);

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    record: newRecords,
  });
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find).sort({ position: "desc" });

  const newRecords = createTreeHelper.createTree(records);

  // console.log(newRecords);

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  const permissions = res.locals.role.permissions;
  if (permissions.includes("product-category_create")) {
    if (req.body.position == "") {
      const count = await ProductCategory.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } else {
    res.send("403");
    return;
  }
};

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({ _id: id, deleted: false });

    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại danh mục này!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhập thành công!");
  } catch (error) {
    req.flash("error", "Cập nhập thất bại!");
  }
  res.redirect("back");
};
