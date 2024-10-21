import { Schema, model } from "mongoose";

// Define the schema
const schema = new Schema({
    name: String,
    desc: String,
    file: String,
    time: Date
});

// Create the model
const Update = model("Update", schema);

export default Update;