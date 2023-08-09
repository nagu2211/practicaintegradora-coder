import { TicketModelMongoose } from "../DAO/mongo/models/ticket.model.mongoose.js";
import { nanoid } from "nanoid";
import { cartService } from "./cart.service.js";
import { productService } from "./product.service.js";
class TicketService {
    async generateUniqueCode () {
        let uniqueCode = nanoid(); // Generamos un código inicial
      
        // Comprobamos si ya existe un ticket con el mismo código
        const existingTicket = await TicketModelMongoose.findOne({ code: uniqueCode });
      
        // Si ya existe un ticket con ese código, generamos uno nuevo hasta que sea único
        while (existingTicket) {
          uniqueCode = nanoid();
          existingTicket = await TicketModelMongoose.findOne({ code: uniqueCode });
        }
      
        return uniqueCode;
      };
      async finalizarCompra(cid, productsToUpdate,productsNotStock){
        try {
            
            const uniqueCode = await this.generateUniqueCode();
            const cart = await cartService.getOneCartById(cid)
            console.log(cart)
            function calculateTotal(cart) {
              let total = 0;
        
              for (const item of cart) {
                total += item.price * item.quantity;
              }
        
              return total;
            }
        
            const total = calculateTotal(cart.products);
            

            const productsPurchasedInfo =productsToUpdate.map(item => ({
              title: item.title,
              quantity: item.quantity
          }));
            const newTicket = TicketModelMongoose.create({
              code: uniqueCode,
              amount: 100,
              products_purchased : productsPurchasedInfo,
              products_not_purchased : productsNotStock
            });
        
            return newTicket;
          } catch (error) {
            console.error('Error al formalizar la compra:', error);
          }
      }
}

export const ticketService = new TicketService();
