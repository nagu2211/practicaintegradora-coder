import { ticketService } from "../services/ticket.service.js";
class TicketController {
  async getTicket(req, res) {
    const { cid } = req.params;
   const ticket = await ticketService.getTicketById(cid)
   return res.status(200).json({
    status: "success",
    msg: "ticket found",
    payload: ticket,
  });
  }
}

export const ticketController = new TicketController();
