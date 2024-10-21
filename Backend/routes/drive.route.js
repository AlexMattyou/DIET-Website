import express from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import fs from 'fs';
import Team from "../models/team.model.js";
import Gallery from "../models/gallery.model.js";
import Update from "../models/update.model.js";
import Activity from "../models/activities.model.js";
import Research from "../models/research.model.js";

const router = express.Router();
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 30 * 1024 * 1024 }, // Set file size limit (5MB)
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
}).single('file');

// Google Drive API setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
    // keyFile: '/etc/secrets/google-key.json',
    keyFile: 'google-key.json',
    scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth });

router.post('/our-team', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const folderId = '1wwnVAMMvUy53bUf1v8AEp4nG0sAZSVUl'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://lh3.googleusercontent.com/d/${fileId}`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            // Step 5: Update the Team collection with the new image link
            const result = await Team.findOneAndUpdate(
                { _id: req.body.placeID },
                { image: fileLink },
                { upsert: true, new: true }
            );

            // Step 6: Send final response
            return res.json({ link: fileLink, placeID: req.body.placeID, result });

        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

router.post('/gallery-event', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const otherID1 = req.body.otherID1;
            const folderId = '1CFCUg3RzZvvtTXB3M4VLmcB4Cu0iQY5T'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://lh3.googleusercontent.com/d/${fileId}`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            // Step 5: Update the Team collection with the new image link

            try {
                const gallery = await Gallery.findById(req.body.otherID1);

                if (!gallery) {
                    console.error("Year not found with ID:", req.body.otherID1);
                    return res.status(404).json({ message: "Year not found!" });
                }

                const event = gallery.events.id(req.body.placeID); // Find the event by ID within the year
                if (!event) {
                    console.error("Event not found with ID:", req.body.placeID);
                    return res.status(404).json({ message: "Event not found!" });
                }

                // Update only the fields that are present in the request body
                event.image = fileLink;

                await gallery.save();  // Save the updated gallery document
                return res.json({ link: fileLink, placeID: req.body.placeID});
            } catch (error) {
                console.error("Error occurred while updating event:", error);
                res.status(500).json({ message: error.message });
            }
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

router.post('/gallery-images', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const folderId = '1_RoyCb68noGK_z2XkbuVVRRY68wIFnbn'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://lh3.googleusercontent.com/d/${fileId}`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            // Step 5: Update the Team collection with the new image link

            try {
                const gallery = await Gallery.findById(req.body.otherID1);

                if (!gallery) {
                    console.error("Year not found with ID:", req.body.otherID1);
                    return res.status(404).json({ message: "Year not found!" });
                }

                const event = gallery.events.id(req.body.otherID2); // Find the event by ID within the year
                if (!event) {
                    console.error("Event not found with ID:", req.body.placeID);
                    return res.status(404).json({ message: "Event not found!" });
                }

                const photo = event.photos.id(req.body.placeID);

                // Update only the fields that are present in the request body
                photo.image = fileLink;

                await gallery.save();  // Save the updated gallery document
                return res.json({ link: fileLink, placeID: req.body.placeID});
            } catch (error) {
                console.error("Error occurred while updating event:", error);
                res.status(500).json({ message: error.message });
            }
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

router.post('/latest-updates', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const folderId = '1j3TAzXI0Veix05qaQa4U4CpB-eE0WHcY'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://drive.google.com/file/d/${fileId}`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            // Step 5: Update the Team collection with the new image link
            const result = await Update.findOneAndUpdate(
                { _id: req.body.placeID },
                { file: fileLink },
                { upsert: true, new: true }
            );

            return res.json({ link: fileLink, placeID: req.body.placeID, result });
            
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

router.post('/activity', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const folderId = '1XfUxxucAaSftAuSFgF5Bs93myNrXIMjI'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://lh3.googleusercontent.com/d/${fileId}`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            // Step 5: Update the Team collection with the new image link
            const result = await Activity.findOneAndUpdate(
                { _id: req.body.placeID },
                { image: fileLink },
                { upsert: true, new: true }
            );

            // Step 6: Send final response
            return res.json({ link: fileLink, placeID: req.body.placeID, result });

        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

router.post('/research', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error: ' + err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const filePath = req.file.path;
            const fileName = req.body.placeID;
            const folderId = '1OPOel70FHjg3ekuRuSYIL1foWuyVvPih'; // Google Drive folder ID

            // Step 1: Check for existing file with the same name
            const fileList = await drive.files.list({
                q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
                fields: 'files(id, name)',
            });

            // Step 2: Delete existing file (if it exists)
            if (fileList.data.files.length > 0) {
                const existingFileId = fileList.data.files[0].id;
                await drive.files.delete({ fileId: existingFileId });
            }

            // Step 3: Upload new file to Google Drive
            const response = await drive.files.create({
                requestBody: {
                    name: fileName,
                    mimeType: req.file.mimetype,
                    parents: [folderId],
                },
                media: {
                    mimeType: req.file.mimetype,
                    body: fs.createReadStream(filePath),
                },
            });

            const fileId = response.data.id;

            // Step 4: Make the file publicly accessible
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const fileLink = `https://drive.google.com/file/d/${fileId}/preview`;

            // Delete the local file after upload
            fs.unlinkSync(filePath);

            console.log(filePath);

            // Step 5: Update the Team collection with the new image link
            const result = await Research.findOneAndUpdate(
                { _id: req.body.placeID },
                { "content.doc": fileLink },
                { upsert: true, new: true }
            );

            return res.json({ link: fileLink, placeID: req.body.placeID, result });
            
        } catch (error) {
            console.error('Error uploading to Google Drive:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    });
});

export default router;
