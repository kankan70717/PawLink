import sightingsModel from "../models/sightingsModel.js";

const postSightingController = async (req, res) => {

	try {
		const sighting = await sightingsModel.postSighting(req.body);
		if (sighting) {
			res.json({ message: `Details of finder with email:`, data: sighting });
		} else {
            res.status(400).json({ error: 'Sighting not posted. Invalid data.' });
		}
	} catch (error) {
		console.error(`Error posting sighting:`, error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export { postSightingController };

