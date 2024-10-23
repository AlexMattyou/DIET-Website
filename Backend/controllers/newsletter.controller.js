import Newsletter from "../models/newsletter.model.js";

export const ReadNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find();
    res.json(newsletters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ message: "Cannot find that newsletter!" });
    }
    res.json(newsletter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CreateNewsletter = async (req, res) => {
  // Validate data (consider implementing validation middleware)
  const newNewsletter = new Newsletter({
    pub_date: new Date(), // Use provided pub_date or current date
    thumb: '',
    doc: '',
    category: req.body.category,
  });

  try {
    const savedNewsletter = await newNewsletter.save();
    res.status(201).json(savedNewsletter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateNewsletter = async (req, res) => {
  try {
    const updatedNewsletter = await Newsletter.findOneAndUpdate(
      { _id: req.params.id },
      {
        pub_date: req.body.pub_date, // Update pub_date if provided
        thumb: req.body.thumb,
        doc: req.body.doc,
      },
      { new: true } // Return the updated document
    );
    if (!updatedNewsletter) {
      return res.status(404).json({ message: "Cannot find that newsletter!" });
    }
    res.status(200).json(updatedNewsletter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const DeleteNewsletter = async (req, res) => {
  const newsletterId = req.params.id;

  try {
    await Newsletter.deleteOne({ _id: newsletterId });
    res.json({ message: "Newsletter deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};