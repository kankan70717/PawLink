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
	const days = parseInt(req.query.days) || 30;

	try {
		const lostPets = await petsModel.getLostPets(days);
		res.json({ message: 'Number of lost pets', data: lostPets });

	} catch (error) {
		console.error('Error fetching lost pets:', error);
		res.json({ error: 'Internal Server Error' });
	}
};

const createPet = (req, res) => {
	const { petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		dateLost,
		ownerEmail,
		image,
		description } = req.body;

	try {
		const result = petsModel.createPet({
			petName,
			species,
			breed,
			color,
			sex,
			birthDate: birthDate === '' ? null : birthDate,
			dateLost,
			ownerEmail,
			image,
			description
		});
		res.json({ message: `Pet ${petName} of species ${species} created.`, data: result });

	} catch (error) {
		console.error('Error creating pet:', error);
		res.json({ error: 'Internal Server Error' });
	}
}

export { getPetsController, getLostPetsController, createPet, getFoundPetsController };