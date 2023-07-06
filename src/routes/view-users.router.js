import express from "express";
export const viewUsersRouter = express.Router();

viewUsersRouter.get("/", async (_, res) => {
  try {
    return res.status(200).render("login");
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page",{msg:"unexpected error on the server"});
  }
});

viewUsersRouter.get("/register", async (_, res) => {
  try {
    return res.status(200).render("register");
  } catch (e) {
    console.log(e);
    return res.status(500).render("error-page",{msg:"unexpected error on the server"});
  }
});

viewUsersRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err)
        return res.status(401).render("error-page",{msg:"logout error"});
      }
      res.redirect("/")
    })
})
