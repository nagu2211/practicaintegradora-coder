import { userModel } from '../DAO/mongo/user.model.js';
// import { userModel } from "../DAO/memory/user.memory.js";

class UserService {
  async getAll() {
    const allUsers = await userModel.getAllUsers();
    let simplifiedUsers = allUsers.map((user) => {
      return {
        _id : user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };
    });
    return simplifiedUsers;
  }
  async create({ firstName, lastName, age, email, password, role }) {
    const userCreated = await userModel.createUser({ firstName, lastName, age, email, password, role });
    return userCreated;
  }
  async findUserByEmail(email) {
    const found = await userModel.findByEmail(email);
    return found || false;
  }
  async findUserByCart(cid) {
    const found = await userModel.findByCart(cid);
    return found || false;
  }
  async findUserById(uid) {
    const found = await userModel.findById(uid);
    return found;
  }
  async login({ email }) {
    const found = await userModel.findUser(email);
    return found || false;
  }
  async updateOne({ _id, firstName, lastName, email }) {
    const userUpdated = await userModel.update({ _id, firstName, lastName, email });
    return userUpdated;
  }
  async updateLastConnection(email) {
    const userUpdated = await userModel.updateLastConnection(email);
    return userUpdated;
  }
  async toggleUserRole(uid) {
    const user = await this.findUserById(uid);
    if (!user) {
      return false;
    }
    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();
    return user.role;
  }
  async updateOneResetPass(email, password) {
    const userUpdated = await userModel.updatePassword(email, password);
    return userUpdated;
  }
  async deleteOne(_id) {
    const deleted = await userModel.delete(_id);
    return deleted;
  }
}

export const userService = new UserService();
