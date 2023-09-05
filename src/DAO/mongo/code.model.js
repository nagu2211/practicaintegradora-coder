import { RecoverCodesModelMongoose } from "./models/recover-codes.model.mongoose.js";

class CodeModel {
    async findOneCode(code,email){
        const findOne = await RecoverCodesModelMongoose.findOne({ code, email });
        return findOne
    }
    async createCode(email,code,expire){
        const createCode = await RecoverCodesModelMongoose.create({
            email,
            code,
            expire,
          });
          return createCode
    }
}

export const codeModel = new CodeModel();
