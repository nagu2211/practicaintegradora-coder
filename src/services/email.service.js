import { __dirname } from "../config.js";
import { transportNodemailer } from "../app.js";
import env from "../config/environment.config.js"

class EmailService {
  async sendTicketForEmail(ticket,userCart){
    const result = await transportNodemailer.sendMail({
        from: " Correo Test de Santi <" + env.googleEmail + ">",
        to: userCart.email,
        subject: "Ticket de compra",
        html: `
        <div>
        <h1>Ticket de compra</h1>
        <p>Detalles de la compra:</p>
        <p>codigo de su ticket (no lo pierda) : ${ticket.code}</p>
        <p>productos adquiridos :</p>
        <ul>
           ${ticket.products_purchased.map((item)=> ` <li><strong>${item.title}</strong>: ${item.quantity}</li>`).join('')}
        </ul>
         <p> productos no adquiridos por falta de stock : ${ticket.products_not_purchased}</p>
        
        <p>Total: $${ticket.amount}</p>
        <p>hora y fecha de compra : ${ticket.purchase_datetime.toLocaleString()}</p>
      </div>
                      `,
        attachments: [
          {
            filename: "giphy.gif",
            path: __dirname + "/images/giphy.gif",
            cid: "giphy",
          },
        ],
      });
  }

}

export const emailService = new EmailService();
