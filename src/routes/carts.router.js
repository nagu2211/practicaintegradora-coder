import express from "express";
import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";

export const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res) => {
  try {
    let carts = await cartService.getAllCarts();
    return res.status(200).json({
      status: "success",
      msg: "all carts",
      payload: carts,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

cartsRouter.post("/", async (_, res) => {
  try {
    let newCart = await cartService.newCart();
    return res.status(201).json({
      status: "success",
      msg: "Cart added",
      payload: newCart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

cartsRouter.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const cart = await cartService.getOneCart(_id);
    return res.status(200).json({
      status: "succes",
      msg: "cart found",
      payload: cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;

    let findProd = await productService.getProductById(pid);

    let findCart = await cartService.getOneCart(cid);
    if (!findProd) {
      return res
        .status(404)
        .json({ status: "error", msg: "product not found", payload: {} });
    } else if (!findCart) {
      return res
        .status(404)
        .json({ status: "error", msg: "cart not found", payload: {} });
    } else {
      return res.status(201).json({
        status: "success",
        msg: "product added to cart",
        payload: await cartService.addProductToCart(cid, pid),
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});
