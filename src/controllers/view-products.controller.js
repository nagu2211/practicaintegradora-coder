import { productService } from '../services/product.service.js';
import { formatCurrentDate } from '../utils/currentDate.js';
class ViewProductsController {
  getAll = async (req, res) => {
    try {
      const { querypage } = req.query;
      const productsView = await productService.getAllViews(querypage);
      const emailSession = req.session.user.email;
      const roleSession = req.session.user.role;
      const firstNameSession = req.session.user.firstName;
      const cartSession = req.session.user.cart;
      let isAdmin = false;
      if (roleSession == 'admin') {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      return res.status(200).render('products', {
        firstNameSession,
        emailSession,
        roleSession,
        productsView,
        isAdmin,
        cartSession
      });
    } catch (e) {
      req.logger.error(`Error in getAll products-view : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      let product = await productService.getProductByIdView(pid);
      const emailSession = req.session.user.email;
      const roleSession = req.session.user.role;
      const firstNameSession = req.session.user.firstName;
      const cartSession = req.session.user.cart;
      return res.status(200).render('details', {
        product,
        emailSession,
        roleSession,
        firstNameSession,
        cartSession
      });
    } catch (e) {
      req.logger.error(`Error in getProductById : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
}

export const viewProductsController = new ViewProductsController();
