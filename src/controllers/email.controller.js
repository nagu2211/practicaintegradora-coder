import { transportNodemailer } from "../app.js";
import env from "../config/environment.config.js";
import { __dirname } from "../config.js";
class EmailController {
  sendEmail = async (_, res) => {
    const result = await transportNodemailer.sendMail({
      from: " Correo Test de Santi <" + env.googleEmail + ">",
      to: "santiago2211ar@hotmail.com",
      subject: "Test de nodemailer",
      html: `
                        <div>
                            <h1>HOLA!! </h1>
                            <p>este es un test de mensajeria</p>
                            <img src="cid:giphy" />
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

    console.log(result);
    res.send("Email sent");
  };
}

export const emailController = new EmailController();
