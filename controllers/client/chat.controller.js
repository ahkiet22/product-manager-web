const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /chat
module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  });
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
  });
};
