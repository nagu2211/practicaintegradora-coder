import { TicketModelMongoose } from "../DAO/mongo/models/ticket.model.mongoose.js";
import { ticketService } from "../services/ticket.service.js";
import TicketDTO from "../DAO/DTO/ticket.dto.js";
import { nanoid } from "nanoid";
import { cartService } from "../services/cart.service.js";
class TicketController {
  async purchase(req, res) {
    try {
      const { cid } = req.params; // Asegúrate de obtener el cartId de manera adecuada

      const purchaserEmail = req.session.user.email; // Obtener el correo electrónico del usuario autenticado

      const totalAmount = 100;

      // Crear y guardar un nuevo ticket en la base de datos
      const newTicket = await ticketService.finalizarCompra(
        cid,
        purchaserEmail,
        totalAmount
      );

      // Retornar el nuevo ticket creado como respuesta
      return res.status(200).json({
        status: "success",
        msg: "Compra finalizada",
        payload: newTicket, // Esto debe ser un objeto del tipo Ticket
      });
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      return res.status(500).json({
        status: "error",
        msg: "Error al finalizar la compra",
      });
    }
  }
  async getTicket(req, res) {
    const { cid } = req.params;
    const ticketEmail = req.session.user.email;
    const getCart = await cartService.getOneCartById(cid);

    function calculateTotal(getCart) {
      let total = 0;

      for (const item of getCart) {
        total += item.price * item.quantity;
      }

      return total;
    }

    const total = calculateTotal(getCart);

    const newTicket = {
      cart: cid,
      code: nanoid(),
      amount: total,
      purchaser: ticketEmail,
    };
    return res.send(newTicket);
  }
}

export const ticketController = new TicketController();
