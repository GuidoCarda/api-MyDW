import express from 'express';

import User from './user';
import Post from './post';

const router = express.Router();

router.use('/users', User);
router.use('/posts', Post);

export default router;
