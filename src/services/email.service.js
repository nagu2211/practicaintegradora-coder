import { __dirname } from "../config.js";
import { transportNodemailer } from "../app.js";
import env from "../config/environment.config.js";
import { randomBytes } from "crypto";
import environmentConfig from "../config/environment.config.js";
import { RecoverCodesModelMongoose } from "../DAO/mongo/models/recover-codes.model.mongoose.js";
import { recoverCodeService } from "./recoverCode.service.js";

class EmailService {
  async sendTicketForEmail(ticket, userCart) {
    const result = await transportNodemailer.sendMail({
      from: " Correo Test Backend <" + env.googleEmail + ">",
      to: userCart.email,
      subject: "Ticket de compra",
      html: `
        <div>
        <h1>Ticket de compra</h1>
        <p>Detalles de la compra:</p>
        <p>codigo de su ticket (no lo pierda) : ${ticket.code}</p>
        <p>productos adquiridos :</p>
        <ul>
           ${ticket.products_purchased
             .map(
               (item) =>
                 ` <li><strong>${item.title}</strong>: ${item.quantity}</li>`
             )
             .join("")}
        </ul>
         <p> productos no adquiridos por falta de stock : ${
           ticket.products_not_purchased
         }</p>
        
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
  async sendResetPasswordForEmail(email) {
    const code = randomBytes(20).toString('hex');
    const expire = Date.now() + 3600000;
    const codeSaved = await recoverCodeService.createCode(email,code,expire)
    
    const result = await transportNodemailer.sendMail({
      from: " Correo Test Backend <" + env.googleEmail + ">",
      to: email,
      subject: "Reset Password",
      html: `
        <div>
        <p>We heard that you lost your password. Sorry about that!</p>

        <p>But don't worry! You can use the following button to reset your password:</p>
        <a href="${env.apiUrl}/reset-password?code=${code}&email=${email}"><button>Reset your password</button></a>
        <p>this is your code : ${code}</p>
      </div>
      `,
    });
  }
}

export const emailService = new EmailService();
