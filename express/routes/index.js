import express from 'express';
const router = express.Router();

import petsRouter from './petsRouter.js';
import ownersRouter from './ownersRouter.js';
import findersRouter from './findersRouter.js';
import sightingsRouter from './sightingsRouter.js';

router.use('/pets', petsRouter);
router.use('/owners', ownersRouter);
router.use('/finders', findersRouter);
router.use('/sightings', sightingsRouter);

export default router;