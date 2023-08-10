import { Schema, model } from "mongoose";


const schema = new Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: false },
    products_purchased : [],
    products_not_purchased : [{type:String , default:"none"}],
    email : {type:String, required:true}
});

export const TicketModelMongoose = model("tickets", schema);
