import { Schema, model } from "mongoose";

// Define the schema
const schema = new Schema({
  category: String,
  pub_date: Date,
  thumb: String,
  doc: String
});

// Create the model
const Newsletter = model("Newsletter", schema);

export default Newsletter;