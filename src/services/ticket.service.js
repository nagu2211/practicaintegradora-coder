import { TicketModelMongoose } from "../DAO/mongo/models/ticket.model.mongoose.js";
import { nanoid } from "nanoid";
import { cartService } from "./cart.service.js";
import { productService } from "./product.service.js";
import { userService } from "./user.service.js";
import { userModel } from "../DAO/mongo/user.model.js";
import { emailService } from "./email.service.js";
import { formatCurrentDate } from "../utils/currentDate.js";
class TicketService {
  async generateUniqueCode() {
    let uniqueCode = nanoid();

    const existingTicket = await TicketModelMongoose.findOne({
      code: uniqueCode,
    });

    while (existingTicket) {
      uniqueCode = nanoid();
      existingTicket = await TicketModelMongoose.findOne({ code: uniqueCode });
    }

    return uniqueCode;
  }
  async createTicket(cid){
    const cart = await cartService.getOneCartById(cid)
    const userCart = await userService.findUserByCart(cid);
    const productsToUpdate = [];
      const productsNotStock = [];
      for (const cartProduct of cart.products) {
        const productInfo = await productService.getProductById(
          cartProduct.product
        );
        if (!productInfo) {
          return null
        }

        if (cartProduct.quantity > productInfo.stock) {
          productsNotStock.push(productInfo.title);
      } else if (cartProduct.quantity <= productInfo.stock) {
          await cartService.removeProduct(cid,productInfo._id.toString())
          const newStock = productInfo.stock - cartProduct.quantity;
          await userModel.updateOne(productInfo,newStock)
          productsToUpdate.push({
              title: productInfo.title,
              price: productInfo.price,
              quantity: cartProduct.quantity,
          });
      }
      }
      const ticket = await this.finalizarCompra(cid,productsToUpdate,productsNotStock,userCart)
      const sendEmail = await emailService.sendTicketForEmail(ticket,userCart)
      return ticket
  }
  async finalizarCompra(req,cid, productsToUpdate, productsNotStock,userCart) {
    try {
      const uniqueCode = await this.generateUniqueCode();
      const cart = await cartService.getOneCartById(cid);
      const productsPurchasedInfo = productsToUpdate.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      function calculateTotal(productsToUpdate) {
        let total = 0;

        for (const item of productsToUpdate) {
          total += item.price * item.quantity;
        }

        return total;
      }

      const total = calculateTotal(productsToUpdate);
      const newTicket = TicketModelMongoose.create({
        code: uniqueCode,
        products_purchased: productsPurchasedInfo,
        products_not_purchased: productsNotStock,
        amount: total,
        email : userCart.email
      });

      return newTicket;
    } catch (error) {
      req.logger.error("Error during checkout" + error)
    }
  }
  async getTicketById(cid){
    const ticket = await TicketModelMongoose.findById(cid)
    return ticket
  }

}

export const ticketService = new TicketService();
