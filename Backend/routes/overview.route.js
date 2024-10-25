import express from 'express';
import {
  PostUser,
  PostUpdate,
  GetData
} from "../controllers/overview.controller.js";

const router = express.Router();

router.put("/new_user", PostUser);

router.put("/last_update", PostUpdate);

router.get("/", GetData);

export default router;