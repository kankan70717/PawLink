import express from 'express';
import { createPet, getFoundPetsController, getLostPetsController, getPetsController } from '../controllers/petsController.js';
import { petsValidation } from '../middleware/petsValidation.js';
const petsRouter = express.Router();

petsRouter.get('/', getPetsController);
petsRouter.get('/found', getFoundPetsController);
petsRouter.get('/lost', getLostPetsController);

petsRouter.post('/lost', petsValidation, createPet);

export default petsRouter;