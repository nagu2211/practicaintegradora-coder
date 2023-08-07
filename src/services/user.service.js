import { userModel } from "../models/user.model.js";

class UserService {
  async getAll() {
    const users = userModel.getAllUsers();
    return users;
  }
  async create({ firstName,lastName,age, email, password, role }) {
    const userCreated = await userModel.createUser({firstName,lastName,age, email, password, role });
    return userCreated;
  }
  async findUserByEmail(email) {
    const found = await userModel.findByEmail(email);
    return found || false;
  }
  async login({ email }) {
    const found = await userModel.findUser(email)
    return found || false;
  }
  async updateOne({ _id, firstName, lastName, email }) {
    const userUpdated = await userModel.update({ _id, firstName, lastName, email })
    return userUpdated;
  }
  async deleteOne(_id) {
    const deleted = await userModel.delete(_id);
    return deleted;
  }
}

export const userService = new UserService();
