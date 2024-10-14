import { Schema, model } from "mongoose";

const photoSchema = new Schema({
  image: String,
});

const videoSchema = new Schema({
  video: String,
});

const eventSchema = new Schema({
  name: String,
  image: String,
  info: String,
  photos: [photoSchema],
  videos: [videoSchema]
});

const gallerySchema = new Schema({
  year: { type: String, unique: true , required: true},
  events: [eventSchema]
});

const Gallery = model('Gallery', gallerySchema);

export default Gallery;
