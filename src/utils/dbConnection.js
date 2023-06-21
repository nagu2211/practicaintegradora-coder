import { connect } from "mongoose";
import { ProdModel } from "../DAO/models/product.model.js";

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://SantiagoEspindola:lBpogkidGlw6KEbE@cluster0.4rgowyj.mongodb.net/?retryWrites=true&w=majority",
      {
        dbName: "ecommerce",
      }
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
