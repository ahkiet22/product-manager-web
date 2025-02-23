const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /chat
module.exports.index = async (req, res) => {
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
  });
};
