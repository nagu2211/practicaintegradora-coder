import express from "express";
import cartManager from "../components/CartManager.js";
import productManager from "../components/ProductManager.js";

export const cartsRouter = express.Router();


const cartM = new cartManager();
const productM = new productManager()
const allProducts = productM.readProducts();

cartsRouter.post("/", async (req, res) => {
  let newCart = await cartM.createCart();
  res.status(201).json(newCart);
});

cartsRouter.get("/:cid", async (req, res) => {
  let cid = req.params.cid;
  let cart = await cartM.getCartById(cid);
  if (!cart) {
    res.status(404).json({ status: "error", msg: "cart not found", data: {} });
  } else {
    res.status(200).json({ status: "success", msg: "cart found", data: cart });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  let cid = req.params.cid;
  let pid = req.params.pid;
  let promiseProducts = await allProducts;
  let findProd = promiseProducts.some(prod => prod.id == pid)  
  let readCartProd = await cartM.readCart();
  let findCart = readCartProd.some(cart => cart.idCart == cid)
  if(!findProd){
    return res.status(404).json({ status: "error", msg: "product not found", data: {} });
  } else if (!findCart) {
    return res.status(404).json({ status: "error", msg: "cart not found", data: {} });
  } else {
    return res.status(201).json({ status: "success", msg: "product added to cart", data: await cartM.addProductToCart(cid, pid) });
  }
});

