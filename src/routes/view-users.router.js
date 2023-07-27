import express from "express";
import { viewUsersController } from "../controllers/view-users.controller.js";
export const viewUsersRouter = express.Router();

viewUsersRouter.get("/", viewUsersController.login);

viewUsersRouter.get("/register", viewUsersController.register);

viewUsersRouter.get("/logout", viewUsersController.logout);

viewUsersRouter.get("/fail-register", viewUsersController.failRegister);

viewUsersRouter.get("/fail-login", viewUsersController.failLogin);
