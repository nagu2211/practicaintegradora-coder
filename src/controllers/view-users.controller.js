class ViewUsersController {
  login = async (_, res) => {
    try {
      return res.status(200).render("login");
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  register = async (_, res) => {
    try {
      return res.status(200).render("register");
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(401).render("error-page", { msg: "logout error" });
      }
      res.redirect("/");
    });
  };
  failRegister = (_, res) => {
    return res
      .status(401)
      .render("error-page", { msg: "failure to register the user" });
  };
  failLogin = (_, res) => {
    return res.status(401).render("error-page", { msg: "user not found" });
  };
}

export const viewUsersController = new ViewUsersController();
