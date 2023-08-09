import express from "express";
import { ticketController } from "../controllers/ticket.controller.js";
import { checkLogin } from "../utils/auth.js";
import { nanoid } from "nanoid";
import { cartService } from "../services/cart.service.js";
export const ticketsRouter = express.Router();


ticketsRouter.post("/:cid", ticketController.purchase );
ticketsRouter.get("/cid", ticketController.getTicket);

