import { Schema, model } from "mongoose";

const schema = new Schema({
  userName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  rol: { type: String, default: "user", required: false, max: 100 },
});

export const UserModel = model("users", schema);
