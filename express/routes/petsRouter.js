import express from 'express';
import {  createPetController, getLostPetsController, getLostAndMatchedPetsNumberController, getPetByIdController, updatePetController, getLostPetsNumberController } from '../controllers/petsController.js';
import { petsValidation } from '../middleware/petsValidation.js';
const petsRouter = express.Router();

petsRouter.get('/lost', getLostPetsController);
petsRouter.get('/lost/number', getLostPetsNumberController);
petsRouter.get('/:id', getPetByIdController);
petsRouter.get('/lost-matched/number', getLostAndMatchedPetsNumberController);

petsRouter.post('/lost', petsValidation, createPetController);
petsRouter.put('/lost/:id', petsValidation, updatePetController);

export default petsRouter;