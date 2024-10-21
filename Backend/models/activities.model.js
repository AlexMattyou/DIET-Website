import { Schema, model } from "mongoose";

// Define the schema
const schema = new Schema({
    name: String,
    desc: String,
    image: String,
    event_date: String,
    event_time: String,
    venue: String,
});

// Create the model
const Activity = model("Activity", schema);

export default Activity;
