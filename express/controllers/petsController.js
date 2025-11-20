import petsModel from '../models/petsModel.js';

const getPetsController = async (req, res) => {

	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const pets = await petsModel.getPets(limit, skip);
		res.json({ message: "Pets List", data: pets });

	} catch (error) {
		console.error('Error fetching pets:', error);
		res.json({ error: 'Internal Server Error' });
	}
};

const getPetByIdController = async (req, res) => {
	const petId = req.params.id;

	try {
		const pet = await petsModel.getPetById(petId);
		res.json({ message: `Details of pet ID: ${petId}`, data: pet });

	} catch (error) {
		console.error(`Error fetching pet with ID ${petId}:`, error);
		res.json({ error: 'Internal Server Error' });
	}
}

const getFoundPetsController = async (req, res) => {
	const days = parseInt(req.query.days) || 30;

	try {
		const foundPets = await petsModel.getFoundPets(days);
		res.json({ message: 'Number of found pets', data: foundPets });

	} catch (error) {
		console.error('Error fetching found pets:', error);
		res.json({ error: 'Internal Server Error' });
	}
};

const getLostPetsController = async (req, res) => {
	const days = parseInt(req.query.days) || null;
	const limit = parseInt(req.query.limit) || 10;
	const offset = parseInt(req.query.offset) || 0;

	const filters = {};

	if (req.query.pet_name) {
		filters.pet_name = req.query.pet_name;
	}
	if (req.query.species) {
		filters.species = req.query.species;
	}
	if (req.query.breed) {
		filters.breed = req.query.breed;
	}
	if (req.query.color) {
		filters.color = req.query.color;
	}
	if (req.query.sex) {
		filters.sex = req.query.sex;
	}
	if (req.query.birth_date) {
		filters.birth_date = req.query.birth_date;
	}
	if (req.query.lost_date) {
		filters.lost_date = req.query.lost_date;
	}
	if (req.query.ownerEmail) {
		filters.ownerEmail = req.query.ownerEmail;
	}

	try {
		const lostPets = await petsModel.getLostPets(days, limit, offset, filters);
		res.json({ message: 'Number of lost pets', data: lostPets });

	} catch (error) {
		console.error('Error fetching lost pets:', error);
		res.json({ error: 'Internal Server Error' });
	}
};

const getLostPetsNumberController = async (req, res) => {
	const { startDate, endDate } = req.query;

	try {
		const count = await petsModel.getLostPetsNumber(startDate, endDate);
		res.json({ message: 'Number of lost pets', data: count });

	} catch (error) {
		console.error('Error fetching number of lost pets:', error);
		res.json({ error: 'Internal Server Error' });
	}
};

const createPetController = (req, res) => {
	const { petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		lostDate,
		ownerEmail,
		image,
		description } = req.body;

	console.log('birthDate in controller:', birthDate);
	try {
		const result = petsModel.createPet({
			pet_name: petName,
			species,
			breed,
			color,
			sex,
			birth_date: birthDate === '' ? null : birthDate,
			lost_date: lostDate === '' ? null : lostDate,
			owner_email: ownerEmail,
			image,
			description
		});
		res.json({ message: `Pet ${petName} of species ${species} created.`, data: result });
	} catch (error) {
		console.error('Error creating pet:', error);
		res.json({ error: 'Internal Server Error' });
	}
}

const updatePetController = (req, res) => {
	const { petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		lostDate,
		ownerEmail,
		image,
		description } = req.body;
	const petId = req.params.id;

	const petData = {
		pet_name: petName,
		species,
		breed,
		color,
		sex,
		birth_date: birthDate === '' ? null : birthDate,
		lost_date: lostDate === '' ? null : lostDate,
		owner_email: ownerEmail,
		image,
		description
	}

	try {
		const result = petsModel.updatePet(
			petId,
			petData
		);
		res.json({ message: `Pet ${petName} of species ${species} updated.`, data: result });
	} catch (error) {
		console.error('Error updating pet:', error);
		res.json({ error: 'Internal Server Error' });
	}
}

export { getPetsController, getLostPetsController, getLostPetsNumberController, createPetController, updatePetController, getFoundPetsController, getPetByIdController };