import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./config.js";
import { chatsRouter } from "./routes/chat.router.js";
import { connectMongo } from "./utils/dbConnection.js";
import { connectSocketServer } from "./utils/socketServer.js";
import { productsRouter } from "./routes/products.router.js";
import { viewProductsRouter } from "./routes/view-products.router.js";
import { viewUsersRouter } from "./routes/view-users.router.js";
import { viewCartsRouter } from "./routes/view-carts.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { iniPassport } from "./utils/passport.config.js";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import env from "./config/environment.config.js";
import { ticketsRouter } from "./routes/ticket.router.js";
import nodemailer from "nodemailer"


const PORT = env.port;
const app = express();

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: env.mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 3600,
    }),
    secret: "un-re-secreto",
    resave: true,
    saveUninitialized: true,
  })
);

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}/`);
});
connectSocketServer(httpServer);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

//nodemailer
const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: env.googleEmail,
    pass: env.googlePass,
  },
});
export const transportNodemailer = transport



//Config del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/ticket/" , ticketsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/", viewUsersRouter);
app.use("/products", viewProductsRouter);
app.use("/carts", viewCartsRouter);
app.use("/chat", chatsRouter);

app.get("*", (_, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", payload: {} });
});
