import mongoose from "mongoose";

const { Schema } = mongoose;


const EmailSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    
}, {timestamps: true})


export default mongoose.model("emails", EmailSchema)