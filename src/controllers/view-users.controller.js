import { formatCurrentDate } from "../utils/currentDate.js";
class ViewUsersController {
  login = async (req, res) => {
    try {
      return res.status(200).render("login");
    } catch (e) {
      req.logger.error(`Error in login view-users : ${e.message}` + formatCurrentDate)
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  register = async (req, res) => {
    try {
      return res.status(200).render("register");
    } catch (e) {
      req.logger.error(`Error in register view-users : ${e.message}` + formatCurrentDate)
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        req.logger.error(`Error in logout view-users : ${err.message}` + formatCurrentDate)
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
