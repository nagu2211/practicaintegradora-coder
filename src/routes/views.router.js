import express from "express";
import { productService } from "../services/product.service.js";

export const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    let products = await productService.getAllViews();
    return res.status(200).render("home", {products});
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await productService.getAllViews();
    return res.status(200).render("realTimeProducts", {products});
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});
