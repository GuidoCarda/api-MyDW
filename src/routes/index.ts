import express, { Router } from "express";

import User from "./user";
import Post from "./post";
import Pet from "./pet";

const router: Router = express.Router();

router.use("/users", User);
router.use("/posts", Post);
router.use("/pets", Pet);

export default router;
