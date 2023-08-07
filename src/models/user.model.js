import { UserModelMongoose } from "../DAO/models/User.model.mongoose.js";

class UserModel {
  async getAllUsers() {
    const users = await UserModelMongoose.find(
      {},
      { _id: true, firstName: true, lastName: true, email: true }
    );
    return users;
  }
  async createUser({ firstName, lastName, age, email, password, role }) {
    const userCreated = await UserModelMongoose.create({
      firstName,
      lastName,
      age,
      email,
      password,
      role: role,
      cart: "",
    });
    return userCreated;
  }
  async findByEmail(email) {
    const found = await UserModelMongoose.findOne({ email: email });
    return found || false;
  }
  async findUser(email) {
    const found = await UserModelMongoose.findOne(
      {
        email: email,
      },
      { firstName: true, email: true, password: true, rol: true }
    );
    return found || false;
  }
  async findUserById(id) {
    let user = await UserModelMongoose.findById(id);
    return user
  }
  async update({ _id, firstName, lastName, email }) {
    const userUpdated = await UserModelMongoose.updateOne(
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
  async delete(_id) {
    const deleted = await UserModelMongoose.deleteOne({ _id: _id });
    return deleted;
  }
  async newUser(newUser) {
    let userCreated = await UserModelMongoose.create(newUser);
    return userCreated
  }
}

export const userModel = new UserModel();