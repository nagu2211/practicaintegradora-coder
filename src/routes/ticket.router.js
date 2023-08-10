import express from "express";
import { ticketController } from "../controllers/ticket.controller.js";

export const ticketsRouter = express.Router();

ticketsRouter.get("/:cid", ticketController.getTicket);

