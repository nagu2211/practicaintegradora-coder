import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { Server } from "socket.io";
import { cartsRouter } from "./routes/carts.router.js";
import { productsRouter } from "./routes/products.router.js";
import { viewsRouter } from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import productManager from './components/ProductManager.js'

const productM = new productManager();
const allProducts = productM.readProducts();

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Config del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static("public"));

const httpServer = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const socketServer = new Server(httpServer);

const initialProducts = productM.readProducts();

socketServer.on("connection", (socket) => {
  console.log("cliente conectado");

  socket.on("new-product", async (newProd) => {
    await productM.addProduct(newProd);
    const promiseProducts = await productM.readProducts();
    socketServer.emit("products", promiseProducts);
  });

  // Emitir los productos iniciales al cliente cuando se establece la conexión
  socket.emit("products", initialProducts);

  socket.on("delete-product", async(idProd)=> {
    await productM.deleteProduct(idProd)
    const promiseProducts = await productM.readProducts();
    socketServer.emit("products", promiseProducts)
  })
});


//Router
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);
app.use("/products", viewsRouter);

app.get("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});
