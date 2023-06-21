import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true },
  code: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true, max: 100 },
  thumbnail: { type: String, required: true },
  status: { type: Boolean, default: true },
});
schema.plugin(mongoosePaginate);
export const ProdModel = model("products", schema);
