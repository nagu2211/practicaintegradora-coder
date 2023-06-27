import express from "express";
import { userService } from "../services/user.service.js";
export const sessionsRouter = express.Router();

sessionsRouter.get("/login", async (req, res) => {
  try {
    return res.status(200).render("login");
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

sessionsRouter.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const findUser = await userService.login({ userName, password });
    if (findUser) {
      req.session.userName = findUser.userName;
      req.session.rol = findUser.rol;
      return res.redirect("/products");
    } else {
      res.send("usuario no encontrado");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

sessionsRouter.get("/register", async (req, res) => {
  try {
    return res.status(200).render("register");
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

sessionsRouter.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      res.send("the user already exists");
    } else if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        await userService.create({
            rol: "admin",
            userName,
            email,
            password,
          });
          res.redirect("/api/sessions/login");
      } else {
      await userService.create({
        userName,
        email,
        password,
      });
      res.redirect("/api/sessions/login");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
      }
      res.redirect("/api/sessions/login")
    })
   })
   