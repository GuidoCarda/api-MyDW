import express, { Router } from "express";

import controllers from "./controllers";

const router: Router = express.Router();

router.post("/", controllers.createUser);
router.post("/login", controllers.loginWithEmailPassword);
router.get("/", controllers.getAllUsers);
router.get("/:id", controllers.getUserById);
router.patch("/:id", controllers.updateUser);
router.delete("/:id", controllers.softDeleteUser);

export default router;


