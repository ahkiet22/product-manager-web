const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  // console.log(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/detail/:slugCategory
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugCategory,
      status: "active",
    };
    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });
      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProductsOne(product);

    res.render("client/pages/products/detail.pug", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    status: "active",
    deleted: false,
  });

  const listSubcategory = await productsCategoryHelper.getSubCategory(
    category.id
  );

  const listSubcategoryId = listSubcategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubcategoryId] },
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts,
  });
};
