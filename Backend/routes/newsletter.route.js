import express from 'express';
import { CreateNewsletter, ReadNewsletters, GetNewsletter, UpdateNewsletter, DeleteNewsletter } from "../controllers/newsletter.controller.js";

const router = express.Router();

// Create a new newsletter
router.post("/", CreateNewsletter); // C 

// Get all newsletters
router.get("/", ReadNewsletters); // R

// Get a specific newsletter by ID
router.get("/:id", GetNewsletter); // R

// Update a newsletter by ID
router.put("/:id", UpdateNewsletter); // U

// Delete a newsletter by ID
router.delete("/:id", DeleteNewsletter); // D

export default router;