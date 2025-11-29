import express from 'express';
import { getOwnerByEmail } from '../controllers/ownersController.js';
const ownersRouter = express.Router();

ownersRouter.get('/info', getOwnerByEmail);

export default ownersRouter;