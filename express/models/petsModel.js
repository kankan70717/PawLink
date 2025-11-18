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

const createPet = (petData) => {
	const {
		petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		dateLost,
		image,
		description
	} = petData;

	const sql = `
		INSERT INTO lost_pets (pet_name, image, species, breed, color, sex, birth_date, description, status, lost_date, found_date, owner_id)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	const result = db.prepare(sql).run(
		petName,
		image,
		species,
		breed,
		color,
		sex,
		birthDate,
		description,
		'lost',
		dateLost,
		null,
		'1'
	);

	return result;
};

const petsModel = {
	getPets,
	getLostPets,
	getFoundPets,
	createPet
};

export default petsModel;