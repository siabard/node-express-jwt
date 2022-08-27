import { Router } from "express";
import handleAllUser from "../controllers/usersController.js";

const router = Router();

router.get("/", handleAllUser);

export default router;
