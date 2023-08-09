import { Server } from "socket.io";
import { msgsModel } from "../DAO/mongo/msgs.model.js";
// import { msgsModel } from "../DAO/memory/msgs.memory.js";
import {productModel} from "../DAO/mongo/product.model.js"


export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (socket) => {
    console.log("cliente conectado");

    try {
      const allProducts = await productModel.getAllProducts();
      socket.emit("products", allProducts);
    } catch (e) {
      console.log(e);
    }

    socket.on("new-product", async (newProd) => {
      try {
        await productModel.create(newProd)
        const prods = await productModel.getAllProducts();
        socketServer.emit("products", prods)
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("delete-product", async ({ idProd }) => {
      try {
        await productModel.delete(idProd);
        const prods = await productModel.getAllProducts();
        socketServer.emit("products", prods);
      } catch (e) {
        console.log(e);
      }
    });

    socket.on("msg_front_to_back",async (msg) => {
      try {
        await msgsModel.createMsg(msg)
      } catch (e) {
        console.log(e);
      }
      try {
        const msgs = await msgsModel.getAllMsgs();
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        console.log(e);
      }
    });
  });
}
