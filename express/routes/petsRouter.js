import express from 'express';
import {  createPetController, getFoundPetsController, getLostPetsController, getLostPetsNumberController, getPetByIdController, getPetsController, updatePetController } from '../controllers/petsController.js';
import { petsValidation } from '../middleware/petsValidation.js';
const petsRouter = express.Router();

petsRouter.get('/', getPetsController);
petsRouter.get('/found', getFoundPetsController);
petsRouter.get('/lost', getLostPetsController);
petsRouter.get('/:id', getPetByIdController);
petsRouter.get('/lost/number', getLostPetsNumberController);

petsRouter.post('/lost', petsValidation, createPetController);
petsRouter.put('/lost/:id', petsValidation, updatePetController);

export default petsRouter;