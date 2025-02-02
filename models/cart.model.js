const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const CartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", CartSchema, "carts");

module.exports = Cart;
