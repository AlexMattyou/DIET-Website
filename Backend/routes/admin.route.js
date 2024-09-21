import express from 'express';
import { RegisterAdmin, LoginAdmin } from "../controllers/admin.controller.js"

const router = express.Router()

router.post("/register", RegisterAdmin); //C
router.post("/login", LoginAdmin);

// router.get("/", ReadAdmin);  //R

// router.put("/:id", UpdateAdmin);  //U

// router.delete("/:id", DeleteAdmin); //D

export default router;