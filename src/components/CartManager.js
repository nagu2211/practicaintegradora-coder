import { promises as fs } from "fs";
import { nanoid } from "nanoid";
export default class cartManager {
  constructor() {
    this.products = [];
    this.path = "./carrito.json";
  }
  readCart = async () => {
    let cartString = await fs.readFile(this.path, "utf-8");
    let parse = JSON.parse(cartString);
    return parse;
  };

  createCart = async () => {
    let newCart = { idCart: nanoid(), products: [] };
    let cartParse = await this.readCart();
    cartParse.push(newCart)
    await fs.writeFile(this.path, JSON.stringify(cartParse));
    return newCart
  };
  
  getCartById = async (id) => {
    let cartParse = await this.readCart();
    return cartParse.find(cart => cart.idCart == id)
  }
  addProductToCart = async (cid, pid ) => {
    let cartParse = await this.readCart();
    let cart = cartParse.find(cart => cart.idCart == cid)

    let repeatedProduct = cart.products.find(product => product.idProd == pid)
    
    if(repeatedProduct){
        repeatedProduct.quantity++;
    } else {
    cart.products.push({idProd:pid, quantity:1})
    }
    await fs.writeFile(this.path, JSON.stringify(cartParse));
    return cart
  }
}
