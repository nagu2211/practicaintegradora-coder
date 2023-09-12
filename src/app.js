import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import nodemailer from "nodemailer";
import passport from "passport";
import { __dirname } from "./config.js";
import env from "./config/environment.config.js";
import { cartsRouter } from "./routes/carts.router.js";
import { chatsRouter } from "./routes/chat.router.js";
import { productsRouter } from "./routes/products.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { ticketsRouter } from "./routes/ticket.router.js";
import { viewCartsRouter } from "./routes/view-carts.router.js";
import { viewProductsRouter } from "./routes/view-products.router.js";
import { viewUsersRouter } from "./routes/view-users.router.js";
import { connectMongo } from "./utils/dbConnection.js";
import { iniPassport } from "./utils/passport.config.js";
import { connectSocketServer } from "./utils/socketServer.js";
import { fakeProductsRouter } from "./routes/fakeProducts.router.js";
import { loggerTest } from "./routes/logger-test.js";
import errorHandler from "./middlewares/error.js"
import { devLogger,prodLogger,addLogger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

export const PORT = env.port;

const app = express();

app.use(addLogger)
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
  if(PORT==8080){
    devLogger.info(`Example app listening on port http://localhost:${PORT}/`);
  } else {
    prodLogger.info(`Example app listening on port http://localhost:${PORT}/`);
  }
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

const specs = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Docs of Always Fresh",
      description: 'these documents are from the "always fresh" fruit and vegetable supermarket page',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
});
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/ticket/" , ticketsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/", viewUsersRouter);
app.use("/loggerTest",loggerTest)
app.use("/products", viewProductsRouter);
app.use("/carts", viewCartsRouter);
app.use("/chat", chatsRouter);
app.use("/mockingproducts", fakeProductsRouter)

app.get("*", (_, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", payload: {} });
  });

app.use(errorHandler)