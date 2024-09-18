import express from 'express';
import { MovieIndex } from "../controllers/movies.controller.js"

const router = express.Router()

router.post("/", () => {}); //C

router.get("/", MovieIndex);  //R

router.put("//:id", ()=> {});  //U

router.delete("/:id", () => {}); //D

export default router;