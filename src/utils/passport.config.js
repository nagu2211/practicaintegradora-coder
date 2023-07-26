import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { UserModel } from "../DAO/models/user.model.js";
import { cartService } from "../services/cart.service.js";
import fetch from "node-fetch";
import GitHubStrategy from "passport-github2";
import env from "../config/environment.config.js"

const LocalStrategy = local.Strategy;


export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await UserModel.findOne({ email: username });
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
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          let user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const newUser = {
            email,
            firstName,
            lastName,
            age,
            cart:'',
            password: createHash(password),
          };
          const newAdmin = {
            ...newUser,
            role: "admin",
          };
          if (
            email === env.adminName &&
            password === env.adminPassword
          ) {
            let adminCreated = await UserModel.create(newAdmin);
            const cartNew = await cartService.newCart();
             const cartId = cartNew.toObject();
             const cartStringId = cartId._id.toString();
             adminCreated.cart = cartStringId;
             await adminCreated.save()
            return done(null, adminCreated);
          } else {
            let userCreated = await UserModel.create(newUser);
             const cartNew = await cartService.newCart();
             const cartId = cartNew.toObject();
             const cartStringId = cartId._id.toString();
             userCreated.cart = cartStringId;
             await userCreated.save()
            return done(null, userCreated);
          }
        } catch (e) {
          console.log("Error in register");
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.513fade5fea2a413",
        clientSecret: "c13041e99eb43f76332c89a8e0498963e912ed86",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accesToken, _, profile, done) => {
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

          let user = await UserModel.findOne({ email: profile.email });
          if (!user) {
            const newUser = {
              firstName: profile._json.name || profile._json.login || "noname",
              lastName: "_",
              email: profile.email,
              password: "_",
              cart:''
            };
            let userCreated = await UserModel.create(newUser);
            const cartNew = await cartService.newCart();
            const cartId = cartNew.toObject();
            const cartStringId = cartId._id.toString();
            userCreated.cart = cartStringId;
            await userCreated.save()
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
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
