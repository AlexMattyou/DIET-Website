import express from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import fs from 'fs';
import Team from "../models/team.model.js";

const router = express.Router();
const upload = multer({
    dest: 'uploads/', 
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5MB)
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed!'), false);
        }
    }
}).single('file');

// Google Drive API setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const auth = new google.auth.GoogleAuth({
    keyFile: '/etc/secrets/google-key.json',
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

export default router;

