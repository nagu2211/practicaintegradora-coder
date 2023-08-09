import express from "express";
import { cartController } from "../controllers/cart.controller.js";
// import { } from "../utils/auth.js";

export const cartsRouter = express.Router();

cartsRouter.get("/", cartController.getAllCarts);

cartsRouter.post("/", cartController.newCart);

cartsRouter.get("/:_id", cartController.getOneCart);

cartsRouter.post("/:cid/product/:pid", cartController.addProductToCart);

cartsRouter.delete("/:cid/product/:pid", cartController.removeProduct);

cartsRouter.put("/:cid", cartController.updateCart);

cartsRouter.delete("/:cid", cartController.clearCart);

cartsRouter.put("/:cid/product/:pid",cartController.addProductToCart)

cartsRouter.post("/:cid/purchase", cartController.checkout)
