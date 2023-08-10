import express from "express";
import { emailController } from "../controllers/email.controller.js";

export const emailRouter = express.Router();


emailRouter.post("/", emailController.sendEmail);
