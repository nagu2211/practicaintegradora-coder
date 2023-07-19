import express from "express";
import { productService } from "../services/product.service.js";
import { ProdModel } from "../DAO/models/product.model.js";
import { checkLogin } from "../utils/auth.js";

export const viewProductsRouter = express.Router();

viewProductsRouter.get("/", checkLogin, async (req, res) => {
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
    const emailSession = req.session.user.email;
    const roleSession = req.session.user.role;
    const firstNameSession = req.session.user.firstName;
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
    return res.status(200).render("products", {
      firstNameSession,
      emailSession,
      roleSession,
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
    return res
      .status(500)
      .render("error-page", { msg: "unexpected error on the server" });
  }
});

viewProductsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    let product = await productService.getProductByIdView(pid);
    let prodView = [product];
    return res.status(200).render("details", {
      prodView,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .render("error-page", { msg: "unexpected error on the server" });
  }
});

viewProductsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    let products = await productService.getAllViews();
    return res.status(200).render("realTimeProducts", { products });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .render("error-page", { msg: "unexpected error on the server" });
  }
});
