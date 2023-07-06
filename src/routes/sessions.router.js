import express from "express";
import { userService } from "../services/user.service.js";
export const sessionsRouter = express.Router();

sessionsRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userService.login({ email, password });
    if (findUser) {
      req.session.email = findUser.email;
      req.session.rol = findUser.rol;
      req.session.userName = findUser.userName
      return res.redirect("/products");
    } else {
      res.status(404).render("error-page",{msg:"the user does not exist"});
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page",{msg:"unexpected error on the server"});
  }
});

sessionsRouter.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.status(401).render("error-page",{msg:"user already exist"});
    } else if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        await userService.create({
            rol: "admin",
            userName,
            email,
            password,
          });
          res.redirect("/");
      } else {
      await userService.create({
        userName,
        email,
        password,
      });
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page",{msg:"unexpected error on the server"});
  }
});
   