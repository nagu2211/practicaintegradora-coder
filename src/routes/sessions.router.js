import express from "express";
import passport from 'passport';

export const sessionsRouter = express.Router();

sessionsRouter.post("/login",passport.authenticate('login', { failureRedirect: '/fail-login' }), async (req, res) => {
  try {
    if (!req.user) {
      res.status(404).render("error-page", { msg: "the user does not exist" });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role };
  
    return res.redirect("/products");
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .render("error-page", { msg: "unexpected error on the server" });
  }
});

sessionsRouter.post("/register",passport.authenticate("register",{ failureRedirect: '/fail-register' }), async (req, res) => {
  try {
    if (!req.user) {
      return res
      .status(500)
      .render("error-page", { msg: "something went wrong" });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, role: req.user.role };
  
    return res.redirect("/products");
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .render("error-page", { msg: "unexpected error on the server" });
  }
});

sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

sessionsRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  req.session.user = req.user;
  // Successful authentication, redirect home.
  res.redirect('/products');
});

sessionsRouter.get('/current', (req, res) => {
  const sessionUser = req.session.user
  return res.status(200).json({
    status: "succes",
    msg: "user data",
    payload: sessionUser,
  });
});
