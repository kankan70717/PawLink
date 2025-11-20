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

const getPetById = (petId) => {

	const sql = `
		SELECT *
		FROM lost_pets
		LEFT JOIN owners ON lost_pets.owner_id = owners.owner_id
    	LEFT JOIN sightings ON lost_pets.pet_id = sightings.lost_pet_id
		LEFT JOIN finders ON sightings.finder_id = finders.finder_id
		WHERE lost_pets.pet_id = ?
	`;
	const rows = db.prepare(sql).all(petId);

	const base = rows[0];

	const pet = {
		pet_id: base.pet_id,
		pet_name: base.pet_name,
		species: base.species,
		breed: base.breed,
		color: base.color,
		sex: base.sex,
		birth_date: base.birth_date,
		lost_date: base.lost_date,
		description: base.description,
		image: base.image ? getImageURLFromBlob(base.image) : null,

		owner: {
			owner_name: base.owner_name,
			phone: base.phone,
			email: base.email,
		},

		sightings: rows
			.filter(r => r.sighting_id !== null)
			.map(data => ({
				sighting_id: data.sighting_id,
				sighting_image: data.sighting_image ? getImageURLFromBlob(data.sighting_image) : null,
				sighting_date: data.sighting_date,
				sighting_location: data.sighting_location,
				sighting_description: data.sighting_description,
				created_at: data.created_at,
				finder_id: data.finder_id,
				finder_name: data.finder_name,
				finder_phone: data.finder_phone,
				finder_email: data.finder_email,
			})),
	};

	return pet;
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

const getLostPets = async (days, limit, offset, filters) => {
	let sql = `
		SELECT *
		FROM lost_pets
		WHERE status = 'lost'
	`;

	const params = [];

	if (days) {
		sql += ` AND lost_date >= DATE('now', ?)`;
		params.push(`-${days} days`);
	}

	for (const [key, value] of Object.entries(filters)) {
		sql += ` AND ${key} LIKE ?`;
		params.push(`%${value}%`);
	}

	sql += ` ORDER BY lost_date DESC LIMIT ? OFFSET ?`;
	params.push(limit, offset);

	const pets = db.prepare(sql).all(...params);

	pets.forEach((pet) => {
		if (pet.image) {
			pet.image = getImageURLFromBlob(pet.image);
		}
	});
	return pets;
};

const getLostPetsNumber = async (startDate, endDate) => {

	let sql = `
		SELECT COUNT(*) as count
		FROM lost_pets
		WHERE status = 'lost'
	`;

	const params = [];

	if (startDate) {
		sql += ` AND lost_date >= ?`;
		params.push(startDate);
	}

	if (endDate) {
		sql += ` AND lost_date <= ?`;
		params.push(endDate);
	}

	const result = db.prepare(sql).get(...params);

	return result.count;
};


const createPet = (petData) => {
	const {
		pet_name,
		species,
		breed,
		color,
		sex,
		birth_date,
		lost_date,
		owner_email,
		image,
		description
	} = petData;

	let imageBuffer = null;

	if (image) {
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		imageBuffer = Buffer.from(base64Data, 'base64');
	}

	const sql = `
		INSERT INTO lost_pets (pet_name, image, species, breed, color, sex, birth_date, description, status, lost_date, found_date, owner_id)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`;

	const result = db.prepare(sql).run(
		pet_name,
		imageBuffer,
		species,
		breed,
		color,
		sex,
		birth_date,
		description,
		'lost',
		lost_date || null,
		null,
		'1'
	);

	return result;
};

const updatePet = (petId, petData) => {
	const {
		pet_name,
		species,
		breed,
		color,
		sex,
		birth_date,
		lost_date,
		owner_email,
		image,
		description
	} = petData;

	let imageBuffer = null;

	if (image) {
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		imageBuffer = Buffer.from(base64Data, 'base64');
	}

	const sql = `
		UPDATE lost_pets
		SET pet_name = ?,
			${imageBuffer ? "image = ?," : ""}
			species = ?,
			breed = ?,
			color = ?,
			sex = ?,
			birth_date = ?,
			description = ?,
			lost_date = ?
		WHERE pet_id = ?
	`;

	const params = [
		pet_name,
		imageBuffer ? imageBuffer : null,
		species,
		breed,
		color,
		sex,
		birth_date || null,
		description,
		lost_date || null,
		petId
	];

	const result = db.prepare(sql).run(...params);
	return result;
};


const petsModel = {
	getPets,
	getLostPets,
	getFoundPets,
	getLostPetsNumber,
	createPet,
	getPetById,
	updatePet,
};

export default petsModel;