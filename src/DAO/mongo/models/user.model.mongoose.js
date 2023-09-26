import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  age: { type: Number, required: false },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  cart: { type: String, required: false, unique: true },
  role: { type: String, default: 'user', required: true },
  documents :{
    type:[
      {
        name:{
          type: String
        },
        reference:{
          type: String
        }
      }
    ],
    default:[]
  },
  last_connection: { type: Date, default: Date.now},
});

export const UserModelMongoose = model('users', schema);
