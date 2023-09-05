import { Schema, model } from "mongoose";

const schema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expire: { type: Number, required: true },
});

export const RecoverCodesModelMongoose = model("recover-codes", schema);
