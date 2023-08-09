import express from "express";
import { chatController } from "../controllers/chat.controller.js";
import { checkLogin } from "../utils/auth.js";

export const chatsRouter = express.Router();


chatsRouter.get("/",checkLogin, chatController.getChat);
