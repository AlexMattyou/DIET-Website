import Update from "../models/update.model.js";

export const ReadUpdate = async (req, res) => {
    try {
        const update = await Update.find();
        res.json(update);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const UpdateDetail = async (req, res) => {

    
    try {
        const update = await Update.findById(req.params.id);

        if (update == null){
            return res.status(404).json({message: "Cannot find that News!"});
        }else{
            res.json(update)
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const CreateUpdate = async (req, res) => {
    console.log(req.body);

    // Validate data
const newUpdate = new Update({
    name: req.body.name,
    desc: req.body.desc
});

    try {
        const update = await newUpdate.save();
        return res.status(201).json(update);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const UpdateUpdate = async (req, res) => {
    try {
        const result = await Update.findOneAndUpdate(
            { _id: req.params.id },
            {
                name: req.body.name,
                desc: req.body.desc
            },
            {
                upsert: false, // create if not exist
                new: true // show updated one
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const DeleteUpdate = async (req, res) => {
    const update_id = req.params.id;

    try {
        await Update.deleteOne({ _id: update_id });
        res.json({ message: "Updates Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
