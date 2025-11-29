import express from 'express';
import { getFinderByEmailController } from '../controllers/findersController.js';
const findersRouter = express.Router();

findersRouter.get('/info', getFinderByEmailController);

export default findersRouter;