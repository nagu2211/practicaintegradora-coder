import env from "../config/environment.config.js";
import { isValidPassword } from "../utils/bcrypt.js";
import fetch from "node-fetch";
import { passportService } from "../services/passport.service.js";
import RegisterDTO from "../DAO/DTO/register.dto.js";

class PassportController {
    login=async (username, password, done) => {
        try {
          const user = await passportService.findUser(username)
          
          if (!user) {
            console.log("User Not Found with username (email) " + username);
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            console.log("Invalid Password");
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    register = async (req, username, password, done) => {
        try {
          const register = req.body;
          const registerDTO = new RegisterDTO(register,password);
          let user = await passportService.findUser(username)
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          
          const newAdmin = {
            ...registerDTO,
            role: "superadmin",
          };
          if (
            register.email === env.adminEmail &&
            password === env.adminPassword
          ) {
            let adminCreated = await passportService.newAdmin(newAdmin)
            return done(null, adminCreated);
          } else {
            let userCreated = await passportService.newUser(registerDTO)
            return done(null, userCreated);
          }
        } catch (e) {
          console.log("Error in register");
          console.log(e);
          return done(e);
        }
      }
      github=async (accesToken, _, profile, done) => {
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("cannot get a valid email for this user"));
          }
          profile.email = emailDetail.email;
          let user = await passportService.findUser(profile.email)
          if (!user) {
            const newUser = {
              firstName: profile._json.name || profile._json.login || "noname",
              lastName: "_",
              email: profile.email,
              password: "_",
              cart:''
            };
            let userCreated = await passportService.newUser(newUser)
            console.log("User Registration succesful");
            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (e) {
          console.log("Error en auth github");
          console.log(e);
          return done(e);
        }
      }
}
    
export const passportController = new PassportController();
    