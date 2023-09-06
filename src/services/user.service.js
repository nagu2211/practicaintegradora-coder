import { userModel } from "../DAO/mongo/user.model.js";
// import { userModel } from "../DAO/memory/user.memory.js";

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
  async findUserByCart(cid){
    const found = await userModel.findByCart(cid);
    return found || false;
  }
  async findUserById(uid) {
    const found = await userModel.findById(uid);
    return found;
  }
  async login({ email }) {
    const found = await userModel.findUser(email)
    return found || false;
  }
  async updateOne({ _id, firstName, lastName, email }) {
    const userUpdated = await userModel.update({ _id, firstName, lastName, email })
    return userUpdated;
  }
  async toggleUserRole(uid) {
    const user = await this.findUserById(uid)
    if (!user) {
        return false
      }
    user.role = user.role === 'user' ? 'premium' : 'user';
    await user.save();
    return user.role;
  }
  async updateOneResetPass(email,password) {
    const userUpdated = await userModel.updatePassword(email,password)
    return userUpdated;
  }
  async deleteOne(_id) {
    const deleted = await userModel.delete(_id);
    return deleted;
  }
 
}

export const userService = new UserService();
