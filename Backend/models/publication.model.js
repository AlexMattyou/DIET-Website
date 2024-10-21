import { Schema, model } from "mongoose";

const publicationSchema = new Schema({
  category: String,
  thumb: String,
  link: String,
  pub_date: Date,
});

const Publication = model("Publication", publicationSchema);

export default Publication;