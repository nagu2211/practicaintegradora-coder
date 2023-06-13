import { CartModel } from "../DAO/models/cart.model.js";

class CartService {
  async getAllCarts() {
    const carts = await CartModel.find({});
    return carts;
  }
  async newCart() {
    const newCart = await CartModel.create({});
    return newCart;
  }
  async getOneCart(_id) {
    const getCartById = await CartModel.findOne({ _id });
    return getCartById;
  }
  addProductToCart = async (cid, pid) => {
    const cart = await CartModel.findById(cid);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const product = cart.products.find(
      (product) => product._id.toString() === pid
    );

    if (product) {
      product.quantity++;
    } else {
      cart.products.push({ _id: pid, quantity: 1 });
    }
    await cart.save();

    return cart;
  };
}

export const cartService = new CartService();
