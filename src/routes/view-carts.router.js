import express from "express";
import { cartService } from "../services/cart.service.js";

export const viewCartsRouter = express.Router();

viewCartsRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getOneCart(cid);
    const simplifiedCart = cart.products.map((item) => {
      return {
        thumbnail: item.product.thumbnail,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    return res.status(200).render("cart", { simplifiedCart });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});
