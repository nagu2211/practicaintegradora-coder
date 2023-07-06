import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  age: { type: Number, required: false },
  email: { type: String, required: true, max: 100},
  password: { type: String, required: true, max: 100 },
  rol: { type: String, default: "user", required: false, max: 100 },
});

export const UserModel = model("users", schema);
