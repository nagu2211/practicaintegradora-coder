import express from "express";
import { productService } from "../services/product.service.js";

export const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    const products = await productService.getAll();
    if (!limit) {
      return res.status(200).json({
        status: "success",
        msg: "all products",
        payload: products,
      });
    } else {
      let productLimit = products.slice(0, limit);
      return res.status(200).json({
        status: "success",
        msg: `limit of displayed products: ${limit} `,
        payload: productLimit,
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

productsRouter.get("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const products = await productService.getAll();
    const productById = products.some((prod) => prod.id === _id);
    if (productById) {
      return res.status(200).json({
        status: "success",
        msg: "product found",
        payload: await productService.getProductById(_id),
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", msg: "product not found", payload: {} });
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

productsRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnail } =
      req.body;
    const products = await productService.getAll();
    let repeated = products.some((prod) => prod.code == code);

    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(404)
        .json({ status: "error", msg: "All fields are required", payload: {} });
    } else if (repeated) {
      return res.status(404).json({
        status: "error",
        msg: "Not added: the product is repeated",
        payload: {},
      });
    } else {
      const productAdded = await productService.addProduct({
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      });
      return res.status(201).json({
        status: "success",
        msg: "product added",
        payload: {
          _id: productAdded._id,
          title: productAdded.title,
          description: productAdded.description,
          code: productAdded.code,
          price: productAdded.price,
          stock: productAdded.stock,
          category: productAdded.category,
          thumbnail: productAdded.thumbnail,
        },
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

//en el body poner el id del producto, su elemento a cambiar y su contenido (no todo el objeto)
productsRouter.put("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const updaProd = req.body;
    const products = await productService.getAll();

    const elemento = products.some((el) => el.id === _id);

    if (!elemento) {
      return res
        .status(404)
        .json({ status: "error", msg: "product not found", payload: {} });
    } else {
      // Actualizar solo las propiedades especificadas
      return res.status(200).json({
        status: "success",
        msg: "product updated",
        payload: await productService.updateProduct(_id, updaProd),
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

productsRouter.delete("/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const deleted = await productService.deleteOne(_id);
    if (deleted?.deletedCount > 0) {
      return res.status(200).json({
        status: "success",
        msg: "user deleted",
        payload: {},
      });
    } else {
      return res.status(404).json({
        status: "error",
        msg: "User not found",
        payload: {},
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
