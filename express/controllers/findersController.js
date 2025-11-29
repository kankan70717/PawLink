import findersModel from "../models/findersModel.js";

const getFinderByEmailController = async (req, res) => {
	const email = req.query.email;
	try {
		const finder = await findersModel.getFinderByEmail(email);
		if (finder) {
			res.json({ message: `Details of finder with email: ${email}`, data: finder });
		} else {
			res.status(404).json({ error: 'Finder not found' });
		}
	} catch (error) {
		console.error(`Error fetching finder with email ${email}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export { getFinderByEmailController };

