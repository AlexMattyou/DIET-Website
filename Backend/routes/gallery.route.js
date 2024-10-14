import express from 'express';
import {
    CreateYear,
    ReadYear,
    GetYear,
    UpdateYear,
    DeleteYear,
    CreateEvent,
    GetEvent,
    ReadEvent,
    UpdateEvent,
    DeleteEvent,
    AddPhoto,
    UpdatePhoto,
    DeletePhoto,
    AddVideo,
    UpdateVideo,
    DeleteVideo
} from "../controllers/gallery.controller.js";

const router = express.Router();

// Year Management Routes
router.post("/years", CreateYear);
router.get("/years/:id", ReadYear);
router.get("/years", GetYear);
router.put("/years/:id", UpdateYear);
router.delete("/years/:id", DeleteYear);

// Event Management Routes
router.post("/years/:yearId/events", CreateEvent);
router.get("/years/:yearId/events/:eventId", GetEvent);
router.get("/years/:yearId/events", ReadEvent);
router.put("/years/:yearId/events/:eventId", UpdateEvent);
router.delete("/years/:yearId/events/:eventId", DeleteEvent);

// Photo Management Routes
router.post("/years/:yearId/events/:eventId/photos", AddPhoto);
router.put("/years/:yearId/events/:eventId/photos/:photoId", UpdatePhoto);
router.delete("/years/:yearId/events/:eventId/photos/:photoId", DeletePhoto);

// Video Management Routes
router.post("/years/:yearId/events/:eventId/videos", AddVideo);
router.put("/years/:yearId/events/:eventId/videos/:videoId", UpdateVideo);
router.delete("/years/:yearId/events/:eventId/videos/:videoId", DeleteVideo);

export default router;
