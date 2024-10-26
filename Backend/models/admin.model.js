import { Schema, model } from "mongoose";

// write your scheme
const loginSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    resetToken: String,
    tokenExpiry: Date,
});



// create your model
const Admin = model("Admin", loginSchema);

export default Admin;