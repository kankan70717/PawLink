import express from 'express';
import { postSightingController } from '../controllers/sightingsController.js';
const sightingsRouter = express.Router();

sightingsRouter.post('/', postSightingController);

export default sightingsRouter;