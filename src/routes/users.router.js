import express from "express";
import { viewUsersController } from "../controllers/view-users.controller.js";

export const usersRouter = express.Router();

usersRouter.post("/premium/:uid",viewUsersController.changeRole);

usersRouter.post("/reset-password",viewUsersController.changePassword);