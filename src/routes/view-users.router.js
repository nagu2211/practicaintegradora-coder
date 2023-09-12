import express from "express";
import { viewUsersController } from "../controllers/view-users.controller.js";
export const viewUsersRouter = express.Router();

viewUsersRouter.get("/", viewUsersController.home);

viewUsersRouter.get("/login", viewUsersController.login);

viewUsersRouter.get("/register", viewUsersController.register);

viewUsersRouter.get("/forgot-password", viewUsersController.forgotPassword);

viewUsersRouter.get("/logout", viewUsersController.logout);

viewUsersRouter.get("/fail-register", viewUsersController.failRegister);

viewUsersRouter.get("/fail-login", viewUsersController.failLogin);

viewUsersRouter.get("/reset-password",viewUsersController.resetPassword);

viewUsersRouter.post("/reset-password",viewUsersController.changePassword);

viewUsersRouter.post("/api/users/premium/:uid",viewUsersController.changeRole);

