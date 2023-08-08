import { nanoid } from "nanoid";

class CartModel {
  constructor() {
    this.carts = [];
  }
  async getCarts() {
    return this.carts;
  }
  async createCart() {
    let newCart = { idCart: nanoid(), products: [] };
    let carts = this.getCarts();
    this.carts.push(newCart);
    return carts;
  }
  async findOneCart(_id) {
    const cart = this.carts.find((cart) => cart.idCart === _id);
    return cart || null;
  }
  async findById(cid) {
    const cart = this.carts.find((cart) => cart.idCart === cid);
    return cart || null;
  }
  async newCart(cid, pid) {
    let newCart = { idCart: cid, products: [{ idProd: pid, quantity: 1 }] }
    this.carts.push(newCart);
    return newCart;
  }
  async quantityProdOfCart(cid, pid) {
    const cartFound = await this.findById(cid);
    const productIndex = cartFound.products.findIndex(product => product.idProd === pid);
  
    if (productIndex !== -1) {
      cartFound.products[productIndex].quantity++;
    } else {
      cartFound.products.push({ idProd: pid, quantity: 1 });
    }
  
    return cartFound;
  }
  async findByIdAndUpdate(cid, products) {
    let carts = this.getCarts();
    let cart = carts.find((cart) => cart.idCart == cid);

    let repeatedProduct = cart.products.find(
      (product) => product.idProd == products
    );

    if (repeatedProduct) {
      repeatedProduct.quantity++;
    } else {
      cart.products.push({ idProd: pid, quantity: 1 });
    }

    return cart;
  }
}

export const cartModel = new CartModel();
