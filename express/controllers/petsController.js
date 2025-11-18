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
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getFoundPetsController = async (req, res) => {
	const days = parseInt(req.query.days) || 7;

	try {
		const foundPets = await petsModel.getFoundPets(days);
		res.json({ message: 'Number of found pets', data: foundPets });

	} catch (error) {
		console.error('Error fetching found pets:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const getLostPetsController = async (req, res) => {
	const days = parseInt(req.query.days) || 7;

	try {
		const lostPets = await petsModel.getLostPets(days);
		res.json({ message: 'Number of lost pets', data: lostPets });

	} catch (error) {
		console.error('Error fetching lost pets:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

const createPet = (req, res) => {
	const { name, species } = req.body;
	res.status(201).json({ message: `Pet ${name} of species ${species} created.` });
}

const updatePet = (req, res) => {
	const { id } = req.params;
	const { name, species } = req.body;
	res.json({ message: `Pet with id: ${id} updated to name: ${name}, species: ${species}` });
}

const deletePet = (req, res) => {
	const { id } = req.params;
	res.json({ message: `Pet with id: ${id} deleted.` });
}

const getBreeds = (req, res) => {
	res.json({ message: 'List of Pet breeds' });
};

export { getPetsController, getLostPetsController, createPet, updatePet, deletePet, getBreeds, getFoundPetsController };