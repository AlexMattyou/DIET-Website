import { Schema, model } from "mongoose";

// Define the schema
const schema = new Schema({
    name: String,
    desc: String,
    image: String,
    event_date: String,
    event_time: String,
    event_date_end: String,
    event_time_end: String,
    venue: String,
});

// Create the model
const Activity = model("Activity", schema);

export default Activity;
