import { codeModel } from "../DAO/mongo/code.model.js";

class RecoverCodeService {
  async findOne(code, email) {
    const findCode = await codeModel.findOneCode(code,email)
    return findCode;
  }
  async createCode(email, code, expire) {
    const createCode = await codeModel.createCode(email,code,expire)
    return createCode;
  }
}

export const recoverCodeService = new RecoverCodeService();
