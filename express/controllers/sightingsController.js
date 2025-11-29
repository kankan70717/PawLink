import sightingsModel from "../models/sightingsModel.js";

const postSightingController = async (req, res) => {

	try {
		const sighting = await sightingsModel.postSighting(req.body);
		if (sighting) {
			res.json({ message: `Details of finder with email: ${email}`, data: sighting });
		} else {
			res.status(404).json({ error: 'Sighting not posted' });
		}
	} catch (error) {
		console.error(`Error posting sighting with finder_id ${finder_id} and pet_id ${pet_id}:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export { postSightingController };

