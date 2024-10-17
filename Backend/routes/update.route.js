import express from 'express';
import { CreateUpdate, ReadUpdate, UpdateDetail, UpdateUpdate, DeleteUpdate } from "../controllers/update.controller.js";

const router = express.Router();

// Create a new team
router.post("/", CreateUpdate); // C

// Get all teams
router.get("/", ReadUpdate); // R

// Get a specific team by ID
router.get("/:id", UpdateDetail);

// Update a team by ID
router.put("/:id", UpdateUpdate); // U

// Delete a team by ID
router.delete("/:id", DeleteUpdate); // D

export default router;
