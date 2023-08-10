import { TicketModelMongoose } from "../DAO/mongo/models/ticket.model.mongoose.js";
import { nanoid } from "nanoid";
import { cartService } from "./cart.service.js";
import { productService } from "./product.service.js";
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
  async finalizarCompra(cid, productsToUpdate, productsNotStock,userCart) {
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
      console.error("Error al formalizar la compra:", error);
    }
  }
  async getTicketById(cid){
    const ticket = await TicketModelMongoose.findById(cid)
    return ticket
  }
}

export const ticketService = new TicketService();
