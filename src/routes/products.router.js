import express from "express";
import productManager from "../components/ProductManager.js";

export const productsRouter = express.Router();
const productM = new productManager();
const allProducts = productM.readProducts();

productsRouter.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) {
    return res.status(200).json({
      status: "success",
      msg: "all products",
      data: await allProducts,
    });
  } else {
    let promiseProducts = await allProducts;
    let productLimit = promiseProducts.slice(0, limit);
    return res.status(200).json({
      status: "success",
      msg: `limit of displayed products: ${limit} `,
      data: productLimit,
    });
  }
});

productsRouter.post("/", async (req, res) => {
  let newProduct = req.body;
  let promiseProducts = await allProducts;
  let repeated = promiseProducts.some((prod) => prod.code == newProduct.code);
  if (
    newProduct.title == undefined ||
    newProduct.description == undefined ||
    newProduct.code == undefined ||
    newProduct.price == undefined ||
    newProduct.stock == undefined ||
    newProduct.category == undefined
  ) {
    return res
      .status(404)
      .json({ status: "error", msg: "All fields are required", data: {} });
  } else if (repeated) {
    return res
      .status(404)
      .json({
        status: "error",
        msg: "Not added: the product is repeated",
        data: {},
      });
  } else {
    await productM.addProduct(newProduct);
    res
      .status(201)
      .json({ status: "success", msg: "product added", data: newProduct });
  }
});

//en el body poner el id del producto, su elemento a cambiar y su contenido (no todo el objeto)
productsRouter.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updaProd = req.body;
  let promiseProducts = await allProducts;

  const elemento = promiseProducts.some((el) => el.id === id);

  if (!elemento) {
    return res
      .status(404)
      .json({ status: "error", msg: "product not found", data: {} });
  } else {
    // Actualizar solo las propiedades especificadas
    return res
      .status(200)
      .json({
        status: "success",
        msg: "product updated",
        data: await productM.updateProduct(id, updaProd),
      });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  let id = req.params.pid;
  let promiseProducts = await allProducts;
  let productFound = promiseProducts.some((prod) => prod.id === id);
  if (productFound) {
    return res.status(200).json({
      status: "success",
      msg: "product eliminated",
      data: await productM.deleteProduct(id),
    });
  }
  return res
    .status(404)
    .json({ status: "error", msg: "product not found", data: {} });
});

productsRouter.get("/:pid", async (req, res) => {
  let id = req.params.pid;
  let promiseProducts = await allProducts;
  let productById = promiseProducts.some((prod) => prod.id === id);
  if (productById) {
    return res.status(200).json({
      status: "success",
      msg: "product found",
      data: await productM.getProductById(id),
    });
  } else {
    return res
      .status(404)
      .json({ status: "error", msg: "product not found", data: {} });
  }
});

