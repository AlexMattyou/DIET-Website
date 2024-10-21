import express from 'express';
import { CreateActivity, ReadActivity, UpdateActivity, ActivityDetail, DeleteActivity } from "../controllers/activities.controller.js";

const router = express.Router();

// Create a new team
router.post("/", CreateActivity); // C

// Get all teams
router.get("/", ReadActivity); // R

// Get a specific team by ID
router.get("/:id", ActivityDetail);

// Update a team by ID
router.put("/:id", UpdateActivity); // U

// Delete a team by ID
router.delete("/:id", DeleteActivity); // D

export default router;
