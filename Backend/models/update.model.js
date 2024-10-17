import { Schema, model } from "mongoose";

// write your schema
const schema = new Schema({
    name: String,
    desc: String,
    file: String
});

// create your model
const Update = model("Update", schema);

export default Update; 
