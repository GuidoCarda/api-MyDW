import { Router } from "express";
import authenticateFirebase from "../../middleware/authenticateFirebase";
import optionalAuthenticateFirebase from "../../middleware/optionalAuthenticateFirebase";
import controllers from "./controllers";

const router: Router = Router();

router.get("/verify/:tagId", controllers.verifyTag);

// route with optional authentication (detects if the user is logged in)
router.get(
  "/info/:tagId",
  optionalAuthenticateFirebase,
  controllers.getTagInfo
);

// protected routes (require authentication)
router.get("/all", authenticateFirebase, controllers.getAllTags);
router.post("/generate", authenticateFirebase, controllers.generateTagBatch);
router.post("/activate/:tagId", authenticateFirebase, controllers.activateTag);

export default router;
