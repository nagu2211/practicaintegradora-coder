import express from "express";
import { viewCartsController } from "../controllers/view-carts.controller.js";


export const viewCartsRouter = express.Router();

viewCartsRouter.get("/:cid", viewCartsController.getOneCart);
