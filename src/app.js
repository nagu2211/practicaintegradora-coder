import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./config.js";
import { chatsRouter } from "./routes/chat.router.js";
import { usersRouter } from "./routes/users.router.js";
import { connectMongo } from "./utils/dbConnection.js";
import { connectSocketServer } from "./utils/socketServer.js";
import { productsRouter } from "./routes/products.router.js";
import { viewProductsRouter } from "./routes/view-products.router.js";
import { viewCartsRouter } from "./routes/view-carts.router.js";
import { sessionsRouter } from "./routes/sessions.router.js";
import { HomeRouter } from "./routes/home.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import session from 'express-session';

const PORT = 8080;
const app = express();

connectMongo();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'un-re-secreto', resave: true, saveUninitialized: true }));
const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
connectSocketServer(httpServer);

//Config del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use("/", HomeRouter);
app.use("/api/carts/", cartsRouter);
app.use("/api/products/", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/products", viewProductsRouter);
app.use("/carts", viewCartsRouter);
app.use("/chat", chatsRouter);

app.get("*", (_, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", payload: {} });
});
