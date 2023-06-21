import { Schema, model } from "mongoose";

const productSchema = new Schema({
  products :{
    type:[
      {
        product:{
          type: Schema.Types.ObjectId,
          ref:"products",
          required:true
        },
        quantity:{
          type:Number,
          required:true,
          default:1
        }
      }
    ],
    default:[]
  }
});

export const CartModel = model("carts", productSchema);
