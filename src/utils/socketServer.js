import { Server } from "socket.io";
import { msgsModel } from "../DAO/mongo/msgs.model.js";
// import { msgsModel } from "../DAO/memory/msgs.memory.js";
import {productModel} from "../DAO/mongo/product.model.js"
import { formatCurrentDate } from "./currentDate.js";
import { devLogger,prodLogger } from "./logger.js";
import { PORT } from "../app.js";
export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (req,socket) => {
    req.logger.info("Client connected")
    
    try {
      const allProducts = await productModel.getAllProducts();
      socket.emit("products", allProducts);
    } catch (e) {
      if(PORT == 8080){
        devLogger.error(`error with products socket : ${e.message}`)
      } else {
        prodLogger.error(`error with products socket : ${e.message}`)
      }
    }

    socket.on("new-product", async (newProd) => {
      try {
        await productModel.create(newProd)
        const prods = await productModel.getAllProducts();
        socketServer.emit("products", prods)
      } catch (e) {
        if(PORT == 8080){
          devLogger.error(`error with new-product socket : ${e.message}`)
        } else {
          prodLogger.error(`error with new-product socket : ${e.message}`)
        }
      }
    });

    socket.on("delete-product", async ({ idProd }) => {
      try {
        await productModel.delete(idProd);
        const prods = await productModel.getAllProducts();
        socketServer.emit("products", prods);
      } catch (e) {
        if(PORT == 8080){
          devLogger.error(`error with delete-product socket : ${e.message}`)
        } else {
          prodLogger.error(`error with delete-product socket : ${e.message}`)
        }
      }
    });

    socket.on("msg_front_to_back",async (msg) => {
      try {
        await msgsModel.createMsg(msg)
      } catch (e) {
        if(PORT == 8080){
          devLogger.error(`error with msg_front_to_back socket : ${e.message}`)
        } else {
          prodLogger.error(`error with msg_front_to_back socket : ${e.message}`)
        }
      }
      try {
        const msgs = await msgsModel.getAllMsgs();
        socketServer.emit("listado_de_msgs", msgs);
      } catch (e) {
        if(PORT == 8080){
          devLogger.error(`error with listado_de_msgs socket : ${e.message}`)
        } else {
          prodLogger.error(`error with listado_de_msgs socket : ${e.message}`)
        }
      }
    });
  });
}
