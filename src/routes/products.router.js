import express from "express";
import { productsController } from "../controllers/products.controller.js";
import { checkAdmin } from "../utils/auth.js";


export const productsRouter = express.Router();

productsRouter.get("/", productsController.getAll);

productsRouter.get("/:_id", productsController.productById)

productsRouter.post("/",  productsController.addProduct);

//en el body poner el id del producto, su elemento a cambiar y su contenido (no todo el objeto)
productsRouter.put("/:_id",  productsController.updateProduct);

productsRouter.delete("/:_id",  productsController.deleteProduct);
