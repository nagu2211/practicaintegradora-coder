import { Schema, model } from "mongoose";

const productSchema = new Schema({
  idProd: { type: Schema.Types.ObjectId, ref: "products" },
  quantity: { type: Number, default: 0 },
});

const schema = new Schema({
  products: {
    type: [productSchema],
    default: [],
  },
});

export const CartModel = model("carts", schema);