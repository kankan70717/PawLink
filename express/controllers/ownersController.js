import ownersModel from '../models/ownersModel.js';

const getOwnerByEmail = async (req, res) => {
	const email = req.query.email;
	try {
		const owner = await ownersModel.getOwnerByEmail(email);
		if (owner) {
			res.json({ message: `Details of owner with email: ${email}`, data: owner });
		} else {
			res.status(404).json({ error: 'Owner not found' });
		}
	} catch (error) {
		console.error(`Error fetching owner with email ${email}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export { getOwnerByEmail };

