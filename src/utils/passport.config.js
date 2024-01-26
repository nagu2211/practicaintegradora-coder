import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import { userModel } from "../DAO/mongo/user.model.js";
import { passportController } from "../controllers/passport.controller.js";
import env from "../config/environment.config.js";

const LocalStrategy = local.Strategy;

export function iniPassport() {
  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, passportController.login)
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      passportController.register
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: env.githubClientId,
        clientSecret: env.githubClientSecret,
        callbackURL: "http://localhost:10000" + "/api/sessions/githubcallback",
      },
      passportController.github
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findUserById(id)
    done(null, user);
  });
}
