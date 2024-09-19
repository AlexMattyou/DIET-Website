import express from 'express';
import { MovieIndex, MovieDetail, MovieCreate, MovieUpdate, MovieDelete } from "../controllers/movies.controller.js"

const router = express.Router()

router.post("/", MovieCreate); //C

router.get("/", MovieIndex);  //R
router.get("/:id", MovieDetail);

router.put("/:id", MovieUpdate);  //U

router.delete("/:id", MovieDelete); //D

export default router;