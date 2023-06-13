import productManager from "../DAO/ProductManager.js";
import { Server } from "socket.io";
import { MsgModel } from "../DAO/models/msgs.model.js";

const productM = new productManager();
const allProducts = productM.readProducts();

export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("cliente conectado");

    socket.on("new-product", async (newProd) => {
      await productM.addProduct(newProd);
      const promiseProducts = await productM.readProducts();
      socketServer.emit("products", promiseProducts);
    });

    
    socket.emit("products", allProducts);

    socket.on("delete-product", async (idProd) => {
      await productM.deleteProduct(idProd);
      const promiseProducts = await productM.readProducts();
      socketServer.emit("products", promiseProducts);
    });
    
    socket.on("msg_front_to_back", async (msg) => {
      try{
        await MsgModel.create(msg)
      } catch(e){
        console.log(e)
      }
       try{
         const msgs = await MsgModel.find({})
         socketServer.emit("listado_de_msgs", msgs);
       } catch(e){
        console.log(e)
       }
    });
  });
}
