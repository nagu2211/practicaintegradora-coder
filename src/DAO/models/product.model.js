import { Schema, model } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  code: { type: Number, required: true, max: 100 },
  price: { type: Number, required: true, max: 100 },
  stock: { type: Number, required: true, max: 100 },
  category: { type: String, required: true, max: 100 },
  thumbnail: { type: String, required: true, max: 100 },
  status: true
});

export const ProdModel = model("products", schema);
