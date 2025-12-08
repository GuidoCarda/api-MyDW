import express, { Router } from "express";

import controllers from "./controllers";
import validator from "../../middleware/validator";
import { createUserSchema, updateUserSchema } from "./validations";

const router: Router = express.Router();

router.post("/", validator(createUserSchema), controllers.createUser);
router.post("/google", controllers.createGoogleUser);
router.get("/", controllers.getAllUsers);
router.get("/:id", controllers.getUserById);
router.patch("/:id", validator(updateUserSchema), controllers.updateUser);
router.delete("/:id", controllers.softDeleteUser);

export default router;
