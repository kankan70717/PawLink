import { db } from "../app.js";
import { getImageURLFromBlob } from "../utils/imageUtils.js";

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
			id: base.owner_id,
			name: base.owner_name,
			phone: base.owner_phone,
			email: base.owner_email,
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

const getLostAndMatchedPetsNumber = async (startDate, endDate) => {
	let sql = `
		SELECT status, COUNT(*) as count
		FROM lost_pets
		WHERE
	`;

	const params = [];

	if (startDate) {
		sql += ` ( (status = 'lost' AND lost_date >= ?) OR (status = 'matched' AND found_date >= ?) )`;
		params.push(startDate, startDate);
	}

	if (endDate) {
		sql += ` AND ( (status = 'lost' AND lost_date <= ?) OR (status = 'matched' AND found_date <= ?) )`;
		params.push(endDate, endDate);
	}

	sql += ` GROUP BY status`;

	const result = db.prepare(sql).all(...params);

	return result;
};

const getLostPetsNumber = async (days) => {
	let sql = `
		SELECT COUNT(*) as count
		FROM lost_pets
		WHERE status = 'lost'
	`;

	const params = [];

	if (days) {
		sql += ` AND lost_date >= DATE('now', ?)`;
		params.push(`-${days} days`);
	}

	const result = db.prepare(sql).get(...params);
	return result.count;
};

const createPet = async (data) => {
	const {
		pet_name,
		species,
		breed,
		color,
		sex,
		birth_date,
		lost_date,
		image,
		description,
		owner_id,
		owner_email,
		owner_name,
		owner_phone
	} = data;

	let imageBuffer = null;

	if (image) {
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		imageBuffer = Buffer.from(base64Data, "base64");
	}

	try {
		db.exec("BEGIN");

		let ownerID = owner_id;

		if (!ownerID) {
			const stmtOwner = db.prepare(`
                INSERT INTO owners (owner_name, owner_phone, owner_email)
                VALUES (:owner_name, :owner_phone, :owner_email)
            `);
			const resultOwner = stmtOwner.run({
				owner_name,
				owner_phone,
				owner_email
			});

			ownerID = resultOwner.lastInsertRowid;
		}else{
			const stmtUpdateOwner = db.prepare(`
				UPDATE owners
				SET owner_name = :owner_name,
					owner_phone = :owner_phone
				WHERE owner_id = :owner_id
			`);
			stmtUpdateOwner.run({
				owner_name,
				owner_phone,
				owner_id: ownerID
			});
		}

		const stmtPet = db.prepare(`
            INSERT INTO lost_pets
            (pet_name, image, species, breed, color, sex, birth_date, description, status, lost_date, found_date, owner_id)
            VALUES (:pet_name, :image, :species, :breed, :color, :sex, :birth_date, :description, :status, :lost_date, :found_date, :owner_id)
        `);

		const resultPet = stmtPet.run({
			pet_name,
			image: imageBuffer,
			species,
			breed,
			color,
			sex,
			birth_date,
			description,
			status: "lost",
			lost_date: lost_date || null,
			found_date: null,
			owner_id: ownerID
		});

		db.exec("COMMIT");

		return {
			pet_id: resultPet.lastInsertRowid,
			owner_id: ownerID,
		};

	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	}
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
	getLostPets,
	getFoundPets,
	getLostAndMatchedPetsNumber,
	getLostPetsNumber,
	createPet,
	getPetById,
	updatePet,
};

export default petsModel;