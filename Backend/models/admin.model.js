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
});

// create your model
const Login = model("Login", loginSchema);

export default Login;