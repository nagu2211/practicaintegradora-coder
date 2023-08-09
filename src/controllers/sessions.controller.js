import CurrentDTO from "../DAO/DTO/current.dto.js";
class SessionsController {
   login = async (req, res) => {
    try {
      if (!req.user) {
        res
          .status(404)
          .render("error-page", { msg: "the user does not exist" });
      }
      req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        cart: req.user.cart,
      };

      return res.redirect("/products");
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  }
  register = async (req, res) => {
    try {
      if (!req.user) {
        return res
          .status(500)
          .render("error-page", { msg: "something went wrong" });
      }
      req.session.user = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart,
      };

      return res.redirect("/products");
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  }
  githubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
  current =  (req, res) => {
    const user = req.session.user
    const userDTO = new CurrentDTO(user)
 
    return res.status(200).json({
      status: "succes",
      msg: "current user",
      payload: userDTO,
    });
    
  }
}
    
    export const sessionsController = new SessionsController();