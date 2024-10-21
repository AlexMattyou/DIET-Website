import { Publication } from "../models/publication.model.js";

export const ReadPublications = async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetPublication = async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: "Cannot find that publication!" });
    }
    res.json(publication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CreatePublication = async (req, res) => {
  // Validate data (consider implementing validation middleware)
  const newPublication = new Publication({
    category: req.body.category,
    thumb: req.body.thumb,
    link: req.body.link,
    pub_date: req.body.pub_date || new Date(), // Use provided pub_date or current date
  });

  try {
    const savedPublication = await newPublication.save();
    res.status(201).json(savedPublication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdatePublication = async (req, res) => {
  try {
    const updatedPublication = await Publication.findOneAndUpdate(
      { _id: req.params.id },
      {
        category: req.body.category,
        thumb: req.body.thumb,
        link: req.body.link,
        pub_date: req.body.pub_date, // Update pub_date if provided
      },
      { new: true } // Return the updated document
    );
    if (!updatedPublication) {
      return res.status(404).json({ message: "Cannot find that publication!" });
    }
    res.status(200).json(updatedPublication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DeletePublication = async (req, res) => {
  const publicationId = req.params.id;

  try {
    await Publication.deleteOne({ _id: publicationId });
    res.json({ message: "Publication deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};