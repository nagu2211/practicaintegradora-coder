import { connect } from "mongoose";
import env from "../config/environment.config.js"

export async function connectMongo() {
  try {
    await connect(env.mongoUrl);
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
