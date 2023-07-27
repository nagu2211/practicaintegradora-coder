import { productService } from "../services/product.service.js";

class ViewProductsController {
  getAll = async (req, res) => {
    try {
      const { querypage } = req.query;
      const productsView = await productService.getAllViews(querypage);
      const emailSession = req.session.user.email;
      const roleSession = req.session.user.role;
      const firstNameSession = req.session.user.firstName;

      return res.status(200).render("products", {
        firstNameSession,
        emailSession,
        roleSession,
        productsView,
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  };
  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      let product = await productService.getProductByIdView(pid);
      return res.status(200).render("details",{
        product
    });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .render("error-page", { msg: "unexpected error on the server" });
    }
  }
}

export const viewProductsController = new ViewProductsController();
