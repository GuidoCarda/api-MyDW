import { Router } from "express";
import authenticateFirebase from "../../middleware/authenticateFirebase";
import controllers from "../tag/controllers";

const router: Router = Router();

router.get("/verify/:tagId", controllers.verifyTag);

router.post("/generate", controllers.generateTagBatch);

export default router;
