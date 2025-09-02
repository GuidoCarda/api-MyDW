import express from "express";

import controllers from "./controllers";

const router = express.Router();

router.post("/", controllers.createUser);
router.get("/", controllers.getAllUsers);
router.get("/:id", controllers.getUserById);
router.patch("/:id", controllers.updateUser);
router.delete("/:id", controllers.hardDeleteUser);
router.patch('/soft/:id', controllers.softDeleteUser);

export default router;
