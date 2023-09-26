import { recoverCodeService } from "../services/recoverCode.service.js";
import { userService } from "../services/user.service.js";
import { createHash } from "../utils/bcrypt.js";
import { formatCurrentDate } from "../utils/currentDate.js";
class ViewUsersController {
  home = async (req, res) => {
    try {
      return res.status(200).render("home");
    } catch (e) {
      req.logger.error(
        `Error in home : ${e.message}` + formatCurrentDate
      );
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  login = async (req, res) => {
    try {
      return res.status(200).render("login");
    } catch (e) {
      req.logger.error(
        `Error in login view-users : ${e.message}` + formatCurrentDate
      );
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  register = async (req, res) => {
    try {
      return res.status(200).render("register");
    } catch (e) {
      req.logger.error(
        `Error in register view-users : ${e.message}` + formatCurrentDate
      );
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  logout = async (req, res) => {
    const email = req.session.user.email
    const updateCon = await userService.updateLastConnection(email)
    
    req.session.destroy((err) => {
      if (err) {
        req.logger.error(
          `Error in logout view-users : ${err.message}` + formatCurrentDate
        );
        return res.status(401).render("error-page", { msg: "logout error" });
      }
      res.redirect("/");
    });
  };
  failRegister = async (_, res) => {
    return res
      .status(401)
      .render("error-page", { msg: "failure to register the user" });
  };
  failLogin = async (_, res) => {
    return res.status(401).render("error-page", { msg: "password or invalid user" });
  };
  forgotPassword = async (_, res) => {
    return res.status(200).render("forgotPassword");
  };
  resetPassword = async (req, res) => {
    const { code, email } = req.query;
    const foundCode = await recoverCodeService.findOne(code,email)
    if(foundCode && foundCode.expire > Date.now()){
      res.status(200).render("resetPassword", {code,email});
    } else {
      res.status(400).render("forgotPassword",{msg:"your code expired or is invalid"});
    }
  };
  changePassword = async (req, res) => {
    let { code, email, password } = req.body;
    const foundCode = await recoverCodeService.findOne(code,email)
    if(foundCode && foundCode.expire > Date.now()){
      password = createHash(password);
      const updatedUser = await userService.updateOneResetPass(email,password)
      res.status(200).render("success",{msg:"your password was reset correctly"});
    } else {
      res.status(400).render("forgotPassword",{msg:"your code expired or is invalid"});
    }
  };
  changeRole = async (req, res) => {
    try {
      const uid = req.params.uid
      const toggleUserRole = await userService.toggleUserRole(uid);
      if(!toggleUserRole){
        return res
      .status(404)
      .render("error-page", { msg: "user not found" });
      } else {
        res.status(200).render("success",{msg:"your role was changed successfully , role : " + toggleUserRole });
      }
    } catch (e) {
      req.logger.error(`Error when trying to change the role ${e.message}` + formatCurrentDate)
      return res
      .status(500)
      .render("error-page", { msg: "server error : it has not been possible to change the role of the user" });
    }
  };
}

export const viewUsersController = new ViewUsersController();
