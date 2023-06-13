import express from "express";
import { productService } from "../services/product.service.js";

export const viewsRouter = express.Router();


viewsRouter.get("/", async (req, res) => {
  let products = await productService.getAll();
  return res.status(200).render("home",  {products} );
});


viewsRouter.get("/realtimeproducts", async (req, res) => {
  let products = await productService.getAll();
  return res.status(200).render("realTimeProducts",  {products} );
});
