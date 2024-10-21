import express from 'express';
import {
  CreatePublication,
  ReadPublications,
  GetPublication,
  UpdatePublication,
  DeletePublication,
} from "../controllers/publication.controller.js";

const router = express.Router();

// Create a new publication
router.post("/", CreatePublication); // C

// Get all publications
router.get("/", ReadPublications); // R

// Get a specific publication by ID
router.get("/:id", GetPublication); // R

// Update a publication by ID
router.put("/:id", UpdatePublication); // U

// Delete a publication by ID
router.delete("/:id", DeletePublication); // D

export default router;