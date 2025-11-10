import express, { Router } from "express";

import User from "./user";
import Post from "./post";
import Pet from "./pet";
import Tag from "./tag";

const router: Router = express.Router();

router.use("/users", User);
router.use("/posts", Post);
router.use("/pets", Pet);
router.use("/tags", Tag);

export default router;
