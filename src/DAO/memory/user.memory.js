import { nanoid } from "nanoid";

class UserModel {
    constructor(){
        this.users = [];
    }
  async getAllUsers() {
    return this.users
  }
  async createUser({ firstName, lastName, age, email, password, role }) {
    let users = this.getAllUsers()
    let userCreated = {
      id:nanoid(),
      firstName,
      lastName,
      age,
      email,
      password,
      role: role,
      cart: "",
    };
    this.users = [...users, userCreated]
    }
  async findByEmail(email) {
    let users = this.getAllUsers()
    let find = this.users.find((user) => user.email == email)
    return find
  }
  async findUser(email) {
    let users = this.getAllUsers()
    let find = users.find((user) => user.email == email)
    return find || false
  }
  async findUserById(id) {
    let users = this.getAllUsers()
    let find = users.find((user) => user.id == id)
    return find || false
  }
  async update({ _id, firstName, lastName, email }) {
    let getAll = this.getAllUsers()
  
        const indice = getAll.findIndex(ind => ind.id === _id);
      
        if (indice === -1) {
          return null; 
        }
      
        
        const elementUpdate = { ...getAll[indice] };
      
        
        Object.assign(elementUpdate,  firstName, lastName, email);
      
        getAll[indice] = elementUpdate;
      
      
        return elementUpdate;
  }
  async delete(_id) {
    let users = this.getAllUsers()
    const deleted = users.filter((user) => user.id != _id)
    this.users = deleted
    return `the user with the id: ${_id} has been removed`;
  }
  async newUser(newUser) {
    let users = this.getAllUsers();
    let userCreated = {
      id: nanoid(),
      newUser
    };
    this.users = [...users, userCreated];
  }
  
}

export const userModel = new UserModel();
