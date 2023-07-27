import express from "express";
import { checkLogin } from "../utils/auth.js";
import { viewProductsController } from "../controllers/view-products.controller.js";

export const viewProductsRouter = express.Router();

viewProductsRouter.get("/", checkLogin,viewProductsController.getAll );

viewProductsRouter.get("/:pid", checkLogin,viewProductsController.getProductById);

//viewProductsRouter.get("/realtimeproducts", viewProductsController.realTimeProducts);
