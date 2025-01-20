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
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
