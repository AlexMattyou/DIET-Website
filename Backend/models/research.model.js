import { Schema, model } from "mongoose";

// Define the schema
const schema = new Schema({
    title: String,
    author: String,
    content: {
        abstract: String,
        doc: String,
        link: String,
    },
    meta: {
        pub_date: Date,
        category: String,
        department: String, 
    },
    add: {
        keywords: String,
        contributors: String,
    }
});

// Create the model
const Research = model("Research", schema);

export default Research;