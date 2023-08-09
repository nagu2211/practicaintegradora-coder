import { createHash } from "../../utils/bcrypt.js";
export default class RegisterDTO {
    constructor(register,password) {
      this.firstName = register.firstName;
      this.lastName = register.lastName;
      this.age = register.age;
      this.email = register.email;
      this.cart = '';
      this.password = createHash(password)
    }
  }