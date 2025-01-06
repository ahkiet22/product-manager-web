const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus") 

// [GET] /admin/products
module.exports.index = async (req, res) => {
  
  // Loc sp
  const filterStatus = filterStatusHelper(req.query)

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;

    const regex = new RegExp(keyword, "i");
    // console.log(regex);
    find.title = regex;
  }

  const products = await Product.find(find);

  // console.log(products)

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
  });
};
