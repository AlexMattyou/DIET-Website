import express from 'express';
import {ReadResearch, GetResearch, CreateResearch, UpdateResearch, DeleteResearch } from "../controllers/research.controller.js"

const router = express.Router();

// Create a new team
router.post("/", CreateResearch); // C

// Get all teams
router.get("/", ReadResearch); // R

// Get a specific team by ID
router.get("/:id", GetResearch);

// Update a team by ID
router.put("/:id", UpdateResearch); // U

// Delete a team by ID
router.delete("/:id", DeleteResearch); // D

export default router;
