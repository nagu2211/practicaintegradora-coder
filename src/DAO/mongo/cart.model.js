import { CartModelMongoose } from './models/cart.model.mongoose.js';

class CartModel {
  async getCarts() {
    const carts = await CartModelMongoose.find({});
    return carts;
  }
  async createCart() {
    const newCart = await CartModelMongoose.create({});
    return newCart;
  }
  async findOneCart(_id) {
    const cart = await CartModelMongoose.findOne({ _id: _id }).populate('products.product');
    return cart;
  }
  async findById(cid) {
    const cartFound = await CartModelMongoose.findById(cid);
    return cartFound || null;
  }
  async newCart(cid, pid) {
    const newCart = await CartModelMongoose.create({
      _id: cid,
      products: [{ product: pid, quantity: 1 }],
    });
    return newCart;
  }
  async quantityProdOfCart(cid, pid, qtyProduct) {
    const cartFound = await CartModelMongoose.findById(cid);

    if (!cartFound) {
      const newCart = new CartModelMongoose({ _id: cid, products: [] });
      newCart.products.push({ product: pid, quantity: parseInt(qtyProduct) });
      await newCart.save();
      return newCart;
    }
    const productFound = cartFound.products.find((product) => product.product.toString() === pid);
    if (productFound) {
      productFound.quantity = parseInt(productFound.quantity) + parseInt(qtyProduct);
    } else {
      cartFound.products.push({ product: pid, quantity: parseInt(qtyProduct) });
    }
    await cartFound.save();
    return cartFound;
  }
  async findByIdAndUpdate(_id, products) {
    const cart = await CartModelMongoose.findByIdAndUpdate(_id, { products }, { new: true });
    return cart;
  }
}

export const cartModel = new CartModel();
