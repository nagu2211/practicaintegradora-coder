
class MsgsModel {
    constructor(){
        this.msgs = []
    }
  async createMsg(msg){
    let msgCreated = this.msgs.push(msg)
    return msgCreated
  }
  async getAllMsgs(){
    return this.msgs
  }
}

export const msgsModel = new MsgsModel();