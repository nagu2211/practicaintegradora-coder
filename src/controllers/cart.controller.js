import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import { ticketService } from "../services/ticket.service.js";
import { formatCurrentDate } from "../utils/currentDate.js";
class CartController {
  getAllCarts = async (req, res) => {
    try {
      let carts = await cartService.getAllCarts();
      return res.status(200).json({
        status: "success",
        msg: "all carts",
        payload: carts,
      });
    } catch (e) {
      req.logger.error(`Error in getAllCarts ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  newCart = async (req, res) => {
    try {
      let newCart = await cartService.newCart();
      return res.status(201).json({
        status: "success",
        msg: "Cart added",
        payload: newCart,
      });
    } catch (e) {
      req.logger.error(`Error in newCart : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  getOneCart = async (req, res) => {
    try {
      const { _id } = req.params;
      const cart = await cartService.getOneCart(_id);
      return res.status(200).json({
        status: "succes",
        msg: "cart found",
        payload: cart,
      });
    } catch (e) {
      req.logger.error(`Error in getOneCart : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  addProductToCart = async (req, res) => {
    try {
      let { cid, pid } = req.params;
      const productFound = await productService.getProductById(pid)
      if(productFound.owner == req.session.user.email){
        return res.status(409).json({
          status: "error",
          msg: "you cannot add your product to your cart",
          payload: {},
        });
        
      } else{
        const cart = await cartService.addProductToCart(cid, pid);

        return res.status(200).json({
          status: "success",
          msg: "product added to cart",
          payload: cart,
        });
      }
      
    } catch (e) {
      req.logger.error(`Error in addProductToCart : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };

  removeProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      await cartService.removeProduct(cid, pid);

      return res
        .status(200)
        .json({ status: "succes", message: "product removed from cart" });
    } catch (e) {
      req.logger.error(`Error in removeProduct : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  updateCart = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      const cart = await cartService.updateCart(cid, products);

      return res
        .status(200)
        .json({ status: "succes", message: "cart updated succesfully", cart });
    } catch (e) {
      req.logger.error(`Error in updateCart : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  updateProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartService.addProductToCart(cid, pid);
      res.status(201).json(cart);
    } catch (e) {
      req.logger.error(`Error in updateProduct : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  clearCart = async (req, res) => {
    try {
      const { cid } = req.params;

      await cartService.clearCart(cid);

      return res
        .status(200)
        .json({ status: "succes", message: "the cart has been cleared" });
    } catch (e) {
      req.logger.error(`Error in clearCart : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  checkout = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getOneCartById(cid);
      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", message: "Cart not found" });
      }
      const createTicket = await ticketService.createTicket(cid)
      if (createTicket == null) {
        return res
          .status(400)
          .json({
            message: `Product/s not found`,
          });
      }
  
      return res
        .status(200)
        .json({ status: "success", message: "Compra completada con éxito", payload : createTicket});
    } catch (e) {
      req.logger.error(`Error in checkout : ${e.message}` + formatCurrentDate)
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
}

export const cartController = new CartController();
