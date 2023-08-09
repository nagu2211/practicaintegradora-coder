import { ProdModelMongoose } from "../DAO/mongo/models/product.model.mongoose.js";
import { cartService } from "../services/cart.service.js";
import { productService } from "../services/product.service.js";
import {ticketService} from "../services/ticket.service.js"
class CartController {
  getAllCarts = async (_, res) => {
    try {
      let carts = await cartService.getAllCarts();
      return res.status(200).json({
        status: "success",
        msg: "all carts",
        payload: carts,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
  newCart = async (_, res) => {
    try {
      let newCart = await cartService.newCart();
      return res.status(201).json({
        status: "success",
        msg: "Cart added",
        payload: newCart,
      });
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
      const cart = await cartService.addProductToCart(cid, pid);

      return res.status(200).json({
        status: "success",
        msg: "product added to cart",
        payload: cart,
      });
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
      console.log(e);
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
          .json({ status: "error", message: "Carrito no encontrado" });
      }

      const productsToUpdate = [];
      const productsNotStock = [];
      for (const cartProduct of cart.products) {
        const productInfo = await productService.getProductById(
          cartProduct.product
        );
        if (!productInfo) {
          return res
            .status(400)
            .json({
              message: `Producto no encontrado: ${cartProduct.product}`,
            });
        }

        if (cartProduct.quantity > productInfo.stock) {
          productsNotStock.push(productInfo.title);
      } else if (cartProduct.quantity <= productInfo.stock) {
          const newStock = productInfo.stock - cartProduct.quantity;
          await ProdModelMongoose.updateOne(
              { _id: productInfo._id },
              { $set: { stock: newStock } }
          );
          productsToUpdate.push({
              title: productInfo.title,
              price: productInfo.price,
              quantity: cartProduct.quantity,
          });
      }
      }

      
      const ticket = await ticketService.finalizarCompra(cid,productsToUpdate,productsNotStock)
      return res
        .status(200)
        .json({ status: "success", message: "Compra completada con éxito", payload : ticket});
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };
}

export const cartController = new CartController();
