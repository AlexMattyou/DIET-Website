import { Schema, model } from "mongoose";

// write your schema
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
    },
    occulation: String,
    address: String,
});

// create your model
const Team = model("Team", schema);

export default Team;
