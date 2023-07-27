import express from "express";
import { chatController } from "../controllers/chat.controller.js";


export const chatsRouter = express.Router();


chatsRouter.get("/", chatController.getChat);
