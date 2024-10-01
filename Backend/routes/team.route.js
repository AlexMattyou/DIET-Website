import express from 'express';
import { ReadTeam, GetTeam, CreateTeam, UpdateTeam, DeleteTeam } from "../controllers/team.controller.js";

const router = express.Router();

// Create a new team
router.post("/", CreateTeam); // C

// Get all teams
router.get("/", ReadTeam); // R

// Get a specific team by ID
router.get("/:id", GetTeam);

// Update a team by ID
router.put("/:id", UpdateTeam); // U

// Delete a team by ID
router.delete("/:id", DeleteTeam); // D

export default router;
