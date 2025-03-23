import Activity from "../models/activities.model.js";

export const ReadActivity = async (req, res) => {
    try {
        const activity = await Activity.find();
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const ActivityDetail = async (req, res) => {

    
    try {
        const activity = await Activity.findById(req.params.id);

        if (activity == null){
            return res.status(404).json({message: "Cannot find that News!"});
        }else{
            res.json(activity)
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const CreateActivity = async (req, res) => {
    console.log(req.body);

    // Validate data
    const newActivity = new Activity({
        name: "",
        event_date: new Date().toISOString().split("T")[0], // Format: yyyy-MM-dd
    });

    try {
        const event = await newActivity.save();
        return res.status(201).json(event);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const UpdateActivity = async (req, res) => {
    try {
        const result = await Activity.findOneAndUpdate(
            { _id: req.params.id },
            {
                name: req.body.name,
                desc: req.body.desc,
                event_date: req.body.event_date,
                event_date_end: req.body.event_date_end,
                venue: req.body.venue
            },
            {
                upsert: false, // Do not create if it doesn't exist
                new: true // Return the updated document
            }
        );
        res.status(200).json(result);  // Send back the updated event document
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const DeleteActivity = async (req, res) => {
    const activity_id = req.params.id;

    try {
        await Activity.deleteOne({ _id: activity_id });
        res.json({ message: "Updates Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
