import { cartModel } from "../models/cart.model.js";

class CartService {
  async getAllCarts() {
    const carts = await cartModel.getCarts();
    return carts;
  }
  async newCart() {
    const newCart = await cartModel.createCart();
    return newCart;
  }
  async getOneCart(_id) {
    const cart = await cartModel.findOneCart()
    const simplifiedCart = cart.products.map((item) => {
      return {
        thumbnail: item.product.thumbnail,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      };
    });
    return simplifiedCart ;
  }
   async addProductToCart(cid, pid) {
    const cartFound = await cartModel.findById(cid);

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
      const newCart = cartModel.newCart(cid,pid)
      return newCart;
    }
  };

  async removeProduct(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
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
      const cart = await cartModel.findByIdAndUpdate(cid,products)
      return cart;
    } catch (error) {
      throw new Error("Error updating cart in database");
    }
  }
  async updateProdQuantity(cid, pid, quantity) {
    try {
      const cart = await cartModel.findById(cid);
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
      const cart = await cartModel.findById(cid);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error("Error clearing cart");
    }
  }
}

export const cartService = new CartService();
