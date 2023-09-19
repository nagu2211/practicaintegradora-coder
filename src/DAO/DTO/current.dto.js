
export default class CurrentDTO {
    constructor(user) {
      this._id = user._id
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.age = user.age;
      this.email = user.email;
      this.cart = user.cart;
    }
  }