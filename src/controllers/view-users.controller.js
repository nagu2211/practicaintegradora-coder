import { RecoverCodesModelMongoose } from "../DAO/mongo/models/recover-codes.model.mongoose.js";
import { recoverCodeService } from "../services/recoverCode.service.js";
import { userService } from "../services/user.service.js";
import { createHash } from "../utils/bcrypt.js";
import { formatCurrentDate } from "../utils/currentDate.js";
class ViewUsersController {
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
  logout = (req, res) => {
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
    return res.status(401).render("error-page", { msg: "user not found" });
  };
  forgotPassword = async (_, res) => {
    return res.status(200).render("forgotPassword");
  };
  resetPassword = async (req, res) => {
    const { code, email } = req.query;
    const foundCode = await RecoverCodesModelMongoose.findOne({ code, email });
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
      res.status(400).render("success",{msg:"your password was reset correctly"});
    } else {
      res.status(400).render("forgotPassword",{msg:"your code expired or is invalid"});
    }
  };
}

export const viewUsersController = new ViewUsersController();
