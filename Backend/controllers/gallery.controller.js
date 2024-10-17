import Gallery from "../models/gallery.model.js";

export const CreateYear = async (req, res) => {
    // Validate data
    const newYear = new Gallery({
        year: req.body.year,
        events: [] // Empty events initially
    });

    try {
        const gallery = await newYear.save();
        // Return all the gallery data
        return res.status(201).json(gallery); 
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};



export const GetYear = async (req, res) => {
    try {
        const years = await Gallery.find(); // Fetch all year data
        res.json(years);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const ReadYear = async (req, res) => {
    try {
        const year = await Gallery.findById(req.params.id); // Fetch year by ID

        if (year == null) {
            return res.status(404).json({ message: "Cannot find that year!" });
        } else {
            res.json(year);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const UpdateYear = async (req, res) => {
    try {
        const result = await Gallery.findOneAndUpdate(
            { _id: req.params.id },
            { year: req.body.year },
            { upsert: true, new: true }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const DeleteYear = async (req, res) => {
    const yearId = req.params.id;

    try {
        await Gallery.deleteOne({ _id: yearId });
        res.json({ message: "Year Deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// -> Event

export const GetEvent = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);
        if (!gallery) return res.status(404).json({ message: "Year not found!" });

        const event = gallery.events.id(req.params.eventId); // Find the event by ID within the year
        if (!event) return res.status(404).json({ message: "Event not found!" });

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const ReadEvent = async (req, res) => {
    try {
        // Find the gallery by the given year ID
        const gallery = await Gallery.findById(req.params.yearId);
        if (!gallery) {
            return res.status(404).json({ message: "Year not found!" });
        }

        // Return all events inside the gallery
        res.json(gallery.events);
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: error.message });
    }
};


export const CreateEvent = async (req, res) => {
    try {
        // Find the gallery by year
        const gallery = await Gallery.findById(req.params.yearId);
        if (!gallery) return res.status(404).json({ message: "Year not found!" });

        // Create a new event instance
        const newEvent = {
            name: req.body.name,
            image: req.body.image,
            info: req.body.info,
            photos: [],
            videos: []
        };

        // Push the new event to the gallery's events array
        gallery.events.push(newEvent); 
        
        // Save the gallery
        await gallery.save();
        
        // Return the newly created event, including its _id
        res.status(201).json(gallery.events[gallery.events.length - 1]); // Get the last event added, which is newEvent
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const UpdateEvent = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);

        if (!gallery) {
            console.error("Year not found with ID:", req.params.yearId);
            return res.status(404).json({ message: "Year not found!" });
        }

        const event = gallery.events.id(req.params.eventId); // Find the event by ID within the year
        if (!event) {
            console.error("Event not found with ID:", req.params.eventId);
            return res.status(404).json({ message: "Event not found!" });
        }

        // Update only the fields that are present in the request body
        event.name = req.body.name;
        event.info = req.body.info;

        await gallery.save();  // Save the updated gallery document
        res.status(200).json({ message: "Event updated successfully!", event });
    } catch (error) {
        console.error("Error occurred while updating event:", error);
        res.status(500).json({ message: error.message });
    }
};


export const DeleteEvent = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);

        if (!gallery) {
            console.error("Year not found with ID:", req.params.yearId);
            return res.status(404).json({ message: "Year not found!" });
        }

        // Remove the event using Mongoose's `pull()` method
        const event = gallery.events.id(req.params.eventId); // Find the event by ID
        if (!event) {
            console.error("Event not found with ID:", req.params.eventId);
            return res.status(404).json({ message: "Event not found!" });
        }

        // Pull the event from the `events` array
        gallery.events.pull({ _id: req.params.eventId });

        await gallery.save();  // Save the gallery after removing the event

        res.json({ message: "Event deleted!" });
    } catch (error) {
        console.error("Error occurred while deleting event:", error);
        res.status(500).json({ message: error.message });
    }
};



// photo:

export const AddPhoto = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);
        const event = gallery.events.id(req.params.eventId);

        if (!event) return res.status(404).json({ message: "Event not found!" });

        const newPhoto = { image: req.body.image };
        event.photos.push(newPhoto);
        await gallery.save();

        // Return the new photo along with its ID
        const createdPhoto = event.photos[event.photos.length - 1]; // Get the last added photo
        res.status(201).json(createdPhoto); // This will return the newly added photo with its ID (_id)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const UpdatePhoto = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);
        const event = gallery.events.id(req.params.eventId);
        const photo = event.photos.id(req.params.photoId);

        if (!photo) return res.status(404).json({ message: "Photo not found!" });

        photo.image = req.body.image || photo.image;
        await gallery.save();
        res.status(200).json(photo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const DeletePhoto = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);

        if (!gallery) {
            console.error("Year not found with ID:", req.params.yearId);
            return res.status(404).json({ message: "Year not found!" });
        }

        const event = gallery.events.id(req.params.eventId);
        if (!event) {
            console.error("Event not found with ID:", req.params.eventId);
            return res.status(404).json({ message: "Event not found!" });
        }

        // Pull the photo by its ID from the photos array
        const photo = event.photos.id(req.params.photoId);
        if (!photo) {
            console.error("Photo not found with ID:", req.params.photoId);
            return res.status(404).json({ message: "Photo not found!" });
        }

        event.photos.pull(req.params.photoId);  // Use pull to remove the photo from the array

        await gallery.save();  // Save the changes
        res.json({ message: "Photo deleted successfully!" });
    } catch (error) {
        console.error("Error occurred while deleting photo:", error);
        res.status(500).json({ message: error.message });
    }
};



// video:

export const AddVideo = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);
        const event = gallery.events.id(req.params.eventId);

        if (!event) return res.status(404).json({ message: "Event not found!" });

        const newVideo = { video: req.body.video };
        event.videos.push(newVideo);
        await gallery.save();
        const savedVideo = event.videos[event.videos.length - 1];
        res.status(201).json(savedVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const UpdateVideo = async (req, res) => { 
    try {
        const gallery = await Gallery.findById(req.params.yearId);
        const event = gallery.events.id(req.params.eventId);
        const video = event.videos.id(req.params.videoId);

        if (!video) return res.status(404).json({ message: "Video not found!" });

        video.video = req.body.video || video.video;
        await gallery.save();
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const DeleteVideo = async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.yearId);

        if (!gallery) {
            console.error("Year not found with ID:", req.params.yearId);
            return res.status(404).json({ message: "Year not found!" });
        }

        const event = gallery.events.id(req.params.eventId);
        if (!event) {
            console.error("Event not found with ID:", req.params.eventId);
            return res.status(404).json({ message: "Event not found!" });
        }

        // Pull the video by its ID from the videos array
        const video = event.videos.id(req.params.videoId);
        if (!video) {
            console.error("Video not found with ID:", req.params.videoId);
            return res.status(404).json({ message: "Video not found!" });
        }

        event.videos.pull(req.params.videoId);  // Use pull to remove the video from the array

        await gallery.save();  // Save the changes
        res.json({ message: "Video deleted successfully!" });
    } catch (error) {
        console.error("Error occurred while deleting video:", error);
        res.status(500).json({ message: error.message });
    }
};


