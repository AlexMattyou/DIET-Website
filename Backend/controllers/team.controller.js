import Team from "../models/team.model.js";

export const ReadTeam = async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const GetTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (team == null) {
            return res.status(404).json({ message: "Cannot find that team!" });
        } else {
            res.json(team);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const CreateTeam = async (req, res) => {
    console.log(req.body);

    // Validate data
    const newTeam = new Team({
        name: req.body.name,
        image: req.body.image, // Adjust according to your requirements (e.g., URL or Buffer)
        occulation: req.body.occupation,
        address: req.body.address
    });

    try {
        const team = await newTeam.save();
        return res.status(201).json(team);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const UpdateTeam = async (req, res) => {
    try {
        const result = await Team.findOneAndUpdate(
            { _id: req.params.id },
            {
                name: req.body.name,
                image: req.body.image,
                occulation: req.body.occupation,
                address: req.body.address
            },
            {
                upsert: true, // create if not exist
                new: true // show updated one
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const DeleteTeam = async (req, res) => {
    const teamId = req.params.id;

    try {
        await Team.deleteOne({ _id: teamId });
        res.json({ message: "Team Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
