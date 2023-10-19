import { cartModel } from "../DAO/mongo/cart.model.js";
// import { cartModel } from "../DAO/memory/cart.memory.js";

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
    const cart = await cartModel.findOneCart(_id)
    if(cart.products == []){
      return cart
    } else {
    const simplifiedCart = cart.products.map((item) => {
      return {
        thumbnail: item.product.thumbnail,
        title: item.product.title,
        price: item.product.price,
        productId: item.product._id,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
        _id:item._id
      };
    });
    return simplifiedCart ;
    }
    
  }
  async getOneCartById(cid) {
    const cart = await cartModel.findOneCart( cid );
  
  if (!cart) {
    return null;
  }
  
  return cart;
  }
  async addProductToCart(cid, pid, qtyProduct) {
    const cartFound = await cartModel.findById(cid);
    
    if (cartFound) {
      let productToCart = await cartModel.quantityProdOfCart(cid, pid, qtyProduct);
      return productToCart;
    } else {
      const newCart = await cartModel.newCart(cid, pid);
      return newCart;
    }
  }

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
  async updateCart(_id, products) {
    try {
      const cart = await cartModel.findByIdAndUpdate(_id,products)
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
