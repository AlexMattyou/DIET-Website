import Movie from "../models/movie.model.js";

export const MovieIndex = async (req, res) => {
    try {
        const movies = await Movie.find()
        res.json(movies)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const MovieDetail = async (req, res) => {

    
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie == null){
            return res.status(404).json({message: "Cannot find that movie!"});
        }else{
            res.json(movie)
        }
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const MovieCreate = async (req, res) => {
    // id, title, desc
    console.log(req.body);


    // validate data
    const newMovie = new Movie({
        title: req.body.title,
        desc: req.body.desc
    })

    try{
        const movie = await newMovie.save();
        return res.status(201).json(movie)
    }catch(error){
        return res.status(400).json({ message: error.message});
    }
}

export const MovieUpdate = async (req, res) => {
    
    try {
        const result = await Movie.findOneAndUpdate(
            {_id: req.params.id},
            {
                title: req.body.title,
                desc: req.body.desc
            },{
                upsert: true, // create if not exist
                new: true // show updated one
            });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const MovieDelete = async (req, res) => {
    const movieId = req.params.id;

    try {
        await Movie.deleteOne({ _id: movieId});
        res.json({message: "Movie Deleted!"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}