import express from 'express';
import { getFoundPetsController, getLostPetsController, getPetsController } from '../controllers/petsController.js';
const petsRouter = express.Router();

petsRouter.get('/', getPetsController);
petsRouter.get('/found', getFoundPetsController);
petsRouter.get('/lost', getLostPetsController);

export default petsRouter;