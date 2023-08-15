import express from "express";
import { generateProduct } from "../utils/faker.js";

export const fakeProductsRouter = express.Router();

fakeProductsRouter.get("/", async (req, res) => {
    const products = [];
  
    for (let i = 0; i < 100; i++) {
      products.push(generateProduct());
    }
  
    res.send({ status: "success", msg: "all products: 100 products", payload: products });
  });
