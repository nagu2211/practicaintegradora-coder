import express from "express";
import passport from "passport";
import { sessionsController } from "../controllers/sessions.controller.js";

export const sessionsRouter = express.Router();

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/fail-login" }),
  sessionsController.login
);

sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/fail-register" }),
  sessionsController.register
);

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  sessionsController.githubCallback
);

sessionsRouter.get("/current", sessionsController.current);
