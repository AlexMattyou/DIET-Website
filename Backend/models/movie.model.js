import { Schema, model } from "mongoose";

// write your scheme
const schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: String
});

// create your model
const Movie = model("Movie", schema);

export default Movie;
