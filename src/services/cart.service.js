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
    const cart = await CartModel.findOne({ _id: _id }).populate(
      "products.product"
    );
    return cart;
  }
  addProductToCart = async (cid, pid) => {
    const cartFound = await CartModel.findById(cid);

    if (cartFound) {
      const productFound = cartFound.products.find(
        (product) => product.product.toString() === pid
      );
      if (productFound) {
        productFound.quantity++;
      } else {
        cartFound.products.push({ product: pid, quantity: 1 });
      }
      await cartFound.save();
      return cartFound;
    } else {
      const newCart = await CartModel.create({
        _id: cid,
        products: [{ product: pid, quantity: 1 }],
      });
      return newCart;
    }
  };

  async removeProduct(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );
      if (prodIndex === -1) {
        throw new Error("product not found in cart");
      }
      cart.products.splice(prodIndex, 1);
      await cart.save();
    } catch (error) {
      throw new Error("error removing product from cart");
    }
  }
  async updateCart(cid, products) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error updating cart in database");
    }
  }
  async updateProdQuantity(cid, pid, quantity) {
    try {
      const cart = await CartModel.findById(cid);
      const prodIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid
      );
      if (prodIndex === -1) {
        throw new Error("product not found in cart");
      }
      cart.products[prodIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("error updating product quantity in cart");
    }
  }
  async clearCart(cid) {
    try {
      const cart = await CartModel.findById(cid);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
}

export const cartService = new CartService();
