import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { UserModel } from "../DAO/models/user.model.js";
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
            password: createHash(password),
          };
          const newAdmin = {
            ...newUser,
            rol: "admin"
          };
          if (
            email === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            let adminCreated = await UserModel.create(newAdmin);
            return done(null, adminCreated);
          } else {
            let userCreated = await UserModel.create(newUser);
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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById(id);
    done(null, user);
  });
}
