import express from 'express';
const router = express.Router();

import petsRouter from './petsRouter.js';

router.use('/pets', petsRouter);

export default router;