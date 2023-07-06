import { UserModel } from "../DAO/models/user.model.js";

class UserService {
  async getAll() {
    const users = await UserModel.find(
      {},
      { _id: true, firstName: true, lastName: true, email: true }
    );
    return users;
  }
  async create({ userName, email, password, rol }) {
    const userCreated = await UserModel.create({ userName, email, password, rol:rol });
    return userCreated;
  }
  async findUserByEmail(email) {
    const found = await UserModel.findOne({ email: email });
    return found || false;
  }
  async login({ email, password }) {
    const found = await UserModel.findOne({
      email: email,
      password: password
    }, {userName: true, email: true, password:true,rol:true});
    return found || false;
  }
  async updateOne({ _id, firstName, lastName, email }) {
    const userUpdated = await UserModel.updateOne(
      {
        _id: _id,
      },
      {
        firstName,
        lastName,
        email,
      }
    );
    return userUpdated;
  }
  async deleteOne(_id) {
    const deleted = await UserModel.deleteOne({ _id: _id });
    return deleted;
  }
}

export const userService = new UserService();
