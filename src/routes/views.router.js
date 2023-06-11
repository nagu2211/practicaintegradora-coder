import express from "express";
import productManager from "../components/ProductManager.js";

export const viewsRouter = express.Router();
const productM = new productManager();
const allProducts = productM.readProducts();

viewsRouter.get("/", async (req, res) => {
  let promiseProducts = await allProducts;
  return res.status(200).render("home", { promiseProducts });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  let promiseProducts = await allProducts;
  return res.status(200).render("realTimeProducts", { promiseProducts });
});
