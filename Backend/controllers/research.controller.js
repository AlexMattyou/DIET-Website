import Research from "../models/research.model.js";

export const ReadResearch = async (req, res) => {
    try {
        const teams = await Research.find();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const GetResearch = async (req, res) => {
    try {
        const team = await Research.findById(req.params.id);

        if (team == null) {
            return res.status(404).json({ message: "Cannot find that team!" });
        } else {
            res.json(team);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const CreateResearch= async (req, res) => {
    console.log(req.body);

    // Validate data
    const newResearch = new Research({
        title: '',
        author: '',
        content: {
            abstract: '',
            doc: '',
            link: '',
        },
        meta: {
            pub_date: Date.now(),
            category: '',
            department: '',
        },
        add: {
            keywords: '',
            contributors: '',
        }
    });

    try {
        const research = await newResearch.save();
        return res.status(201).json(research);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const UpdateResearch = async (req, res) => {
    try {
        const result = await Research.findOneAndUpdate(
            { _id: req.params.id }, // Filter by the research ID
            {
                title: req.body.title,
                author: req.body.author,
                "content.abstract": req.body.content?.abstract, // Nested content field
                "content.link": req.body.content?.link,
                "meta.pub_date": req.body.meta?.pub_date,
                "meta.category": req.body.meta?.category,
                "meta.department": req.body.meta?.department,
                "add.keywords": req.body.add?.keywords,
                "add.contributors": req.body.add?.contributors,
            },
            {
                upsert: false, // create a new document if it doesn't exist
                new: true // return the updated document
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const DeleteResearch = async (req, res) => {
    const Research_id = req.params.id;

    try {
        await Research.deleteOne({ _id: Research_id });
        res.json({ message: "Research Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
