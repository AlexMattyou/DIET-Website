import { Schema, model } from "mongoose";

// write your schema
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    teaching: String,
    image: String,
    designation: String,
    address: String,
    phone1: String,
    phone2: String,
});

// create your model
const Team = model("Team", schema);

export default Team;
