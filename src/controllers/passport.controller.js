import env from "../config/environment.config.js";
import { isValidPassword } from "../utils/bcrypt.js";
import fetch from "node-fetch";
import { passportService } from "../services/passport.service.js";
import RegisterDTO from "../DAO/DTO/register.dto.js";
import { formatCurrentDate } from "../utils/currentDate.js";
import { devLogger,prodLogger } from "../utils/logger.js";
import { PORT } from "../app.js";
class PassportController {
    login=async (username, password, done) => {
      try {
          const user = await passportService.findUser(username)
          
          if (!user) {
            if(PORT == 8080){
              devLogger.warn(`Failed login attempt for the user ${username} : user not found`);
            } else {
              prodLogger.warn(`Failed login attempt for the user ${username} : user not found`)
            }
            return done(null, false);
          }
          if (!isValidPassword(password, user.password)) {
            if(PORT == 8080){
              devLogger.warn(`Failed login attempt for the user ${username} : invalid password`);
            } else {
              prodLogger.warn(`Failed login attempt for the user ${username} : invalid password`)
            }
            return done(null, false);
          }
          
          return done(null, user);
        } catch (err) {
          if(PORT == 8080){
            devLogger.error(`Error during the login session : ${err.message} ` + formatCurrentDate);
          } else {
            prodLogger.error(`Error during the login session : ${err.message} ` + formatCurrentDate)
          }
          return done(err);
        }
      }
    register = async (req, username, password, done) => {
        try {
          const register = req.body;
          const registerDTO = new RegisterDTO(register,password);
          let user = await passportService.findUser(username)
          if (user) {
            req.logger.warn(`error during registration for the user ${user} : user already exists`)
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
          req.logger.error(`Error during the register session : ${e.message} ` + formatCurrentDate)
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
            if(PORT == 8080){
              devLogger.info(`User Registration succesful`);
            } else {
              prodLogger.info(`User Registration succesful`)
            }
            return done(null, userCreated);
          } else {
            return done(null, user);
          }
        } catch (e) {
          if(PORT == 8080){
            devLogger.error(`Error when registering with github : ${e.message} ` + formatCurrentDate);
          } else {
            prodLogger.error(`Error when registering with github : ${e.message} ` + formatCurrentDate)
          }
          return done(e);
        }
      }
}
    
export const passportController = new PassportController();
    