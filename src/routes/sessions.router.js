import express from "express";
import { userService } from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
export const sessionsRouter = express.Router();

sessionsRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userService.login({ email });
    if (findUser && isValidPassword(password,findUser.password)) {
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
            password:createHash(password),
          });
          res.redirect("/");
      } else {
      await userService.create({
        userName,
        email,
        password:createHash(password),
      });
      res.redirect("/");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page",{msg:"unexpected error on the server"});
  }
});
   