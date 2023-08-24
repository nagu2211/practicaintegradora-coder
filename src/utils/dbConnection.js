import { connect } from "mongoose";
import env from "../config/environment.config.js"
import { PORT } from "../app.js";
import { devLogger,prodLogger } from "./logger.js";
import { formatCurrentDate } from "./currentDate.js";
export async function connectMongo() {
  try {
    await connect(env.mongoUrl);
    if(PORT == 8080){
      devLogger.info("mongo connected!");
    } else {
      prodLogger.info("mongo connected!")
    }
  } catch (e) {
    if(PORT == 8080){
      devLogger.error("can not connect to the db " + formatCurrentDate);
    } else {
      prodLogger.error("can not connect to the db " + formatCurrentDate);
    }
  }
}
