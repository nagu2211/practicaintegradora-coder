import express from "express";
import { productService } from "../services/product.service.js";
import { cartService } from "../services/cart.service.js";
import { ProdModel } from "../DAO/models/product.model.js";

export const viewsRouter = express.Router();

viewsRouter.get("/products", async (req, res) => {
  try {
    const { querypage } = req.query;
    const queryResult = await ProdModel.paginate(
      {},
      { limit: 5, page: querypage || 1 }
    );
    let prodsPaginated = queryResult.docs;
    prodsPaginated = prodsPaginated.map((prod) => {
      return {
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        code: prod.code,
        price: prod.price,
        stock: prod.stock,
        category: prod.category,
        thumbnail: prod.thumbnail,
        status: prod.status,
      };
    });
    const {
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = queryResult;
    return res.status(200).render("home", {
      prodsPaginated,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
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

viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    let product = await productService.getProductByIdView(pid);
    let prodView = [product];
    return res.status(200).render("details", {
      prodView,
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

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await productService.getAllViews();
    return res.status(200).render("realTimeProducts", { products });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

viewsRouter.get("/cart/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getOneCart(cid);
    const simplifiedCart = cart.products.map(item=>{
      return{
        thumbnail: item.product.thumbnail,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }
    })
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
