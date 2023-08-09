import express from "express";
import { cartController } from "../controllers/cart.controller.js";
import { checkLogin } from "../utils/auth.js";

export const cartsRouter = express.Router();

cartsRouter.get("/", checkLogin,cartController.getAllCarts);

cartsRouter.post("/", checkLogin,cartController.newCart);

cartsRouter.get("/:_id", checkLogin,cartController.getOneCart);

cartsRouter.post("/:cid/product/:pid",checkLogin, cartController.addProductToCart);

cartsRouter.delete("/:cid/product/:pid", checkLogin,cartController.removeProduct);

cartsRouter.put("/:cid", checkLogin,cartController.updateCart);

cartsRouter.delete("/:cid",checkLogin, cartController.clearCart);

cartsRouter.put("/:cid/product/:pid",checkLogin,cartController.addProductToCart)

cartsRouter.post("/:cid/purchase", cartController.checkout)
