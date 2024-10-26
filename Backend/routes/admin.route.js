import express from 'express';
import {ResetRequest, RegisterAdmin, LoginAdmin, VerifyAdmin, VerifyResetToken, ResetPassword} from "../controllers/admin.controller.js"

const router = express.Router()

router.post("/register", RegisterAdmin); //C
router.post("/login", LoginAdmin);

router.get("/verify", VerifyAdmin)

router.post("/reset-password", ResetPassword);

router.post("/reset-request", ResetRequest);

router.post("/verify-reset-token", VerifyResetToken);

// router.get("/", ReadAdmin);  //R

// router.put("/:id", UpdateAdmin);  //U

// router.delete("/:id", DeleteAdmin); //D

export default router; 