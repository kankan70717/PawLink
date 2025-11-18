import { db } from "../app.js";
import { getImageURLFromBlob } from "../utils/imageUtils.js";

const getPets = (limit = 5, skip = 0) => {

	const pets = db
		.prepare('SELECT * FROM lost_pets LIMIT ? OFFSET ?')
		.all(limit, skip);

	pets.forEach((pet) => {
		if (pet.image) {
			pet.image = getImageURLFromBlob(pet.image);
		}
	});
	return pets;
};

const getFoundPets = async (days) => {

	const sql = `
		SELECT *
    	FROM lost_pets
    	WHERE status = 'matched'
      		AND found_date >= DATE('now', ?)
	`;

	const pets = db
		.prepare(sql)
		.all(`-${days} days`);

	pets.forEach((pet) => {
		if (pet.image) {
			pet.image = getImageURLFromBlob(pet.image);
		}
	});
	return pets;
};

const getLostPets = async (days) => {

	const sql = `
		SELECT *
    	FROM lost_pets
    	WHERE status = 'lost'
      		AND lost_date >= DATE('now', ?)
	`;

	const pets = db
		.prepare(sql)
		.all(`-${days} days`);

	pets.forEach((pet) => {
		if (pet.image) {
			pet.image = getImageURLFromBlob(pet.image);
		}
	});
	return pets;
}

const petsModel = {
	getPets,
	getLostPets,
	getFoundPets
};

export default petsModel;