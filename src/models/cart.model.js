import { CartModelMongoose } from "../DAO/models/cart.model.mongoose.js";

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
    const cart = await CartModelMongoose.findOne({ _id: _id }).populate(
      "products.product"
    );
    return cart;
  }
  async findById(cid) {
    const cartFound = await CartModelMongoose.findById(cid);
    return cartFound;
  }
  async newCart(cid, pid) {
    const newCart = await CartModelMongoose.create({
      _id: cid,
      products: [{ product: pid, quantity: 1 }],
    });
    return newCart;
  }
  async findByIdAndUpdate(cid,products){
    const cart = await CartModelMongoose.findByIdAndUpdate(
        cid,
        { products },
        { new: true }
      );
      return cart;
  }
}

export const cartModel = new CartModel();
