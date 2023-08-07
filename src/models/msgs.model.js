import { MsgsModelMongoose } from "../DAO/models/msgs.model.mongoose.js";

class MsgsModel {
  async createMsg(msg){
    let msgCreated = await MsgsModelMongoose.create(msg);
    return msgCreated
  }
  async getAllMsgs(){
    const msgs = await MsgsModelMongoose.find({});
    return msgs
  }
}

export const msgsModel = new MsgsModel();
