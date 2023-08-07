import { userModel } from "../models/user.model.js";
import { cartService } from "./cart.service.js";
class PassportService {
  async findUser(username) {
    const user = await userModel.findByEmail(username);
    return user;
  }
  async newUser(newUser) {
    let userCreated = await userModel.newUser(newUser)
    const cartNew = await cartService.newCart();
    const cartId = cartNew.toObject();
    const cartStringId = cartId._id.toString();
    userCreated.cart = cartStringId;
    await userCreated.save();
    return userCreated;
  }
  async newAdmin(newAdmin) {
    let adminCreated = await userModel.newUser(newAdmin)
    const cartNew = await cartService.newCart();
    const cartId = cartNew.toObject();
    const cartStringId = cartId._id.toString();
    adminCreated.cart = cartStringId;
    await adminCreated.save();
    return adminCreated
  }
}

export const passportService = new PassportService();
