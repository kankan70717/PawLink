import { db } from "../app.js";

const postSighting = async (data) => {
	const {
		sightingLocation,
		sightingDescription,
		image,
		finderID,
		finderName,
		finderPhone,
		finderEmail,
		petId
	} = data;

	let imageBuffer = null;

	if (image) {
		const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
		imageBuffer = Buffer.from(base64Data, "base64");
	}

	try {
		db.exec("BEGIN");

		let finder_id = finderID;

		if (!finder_id) {
			const stmtFinder = db.prepare(`
                INSERT INTO finders (finder_name, finder_phone, finder_email)
                VALUES (:finder_name, :finder_phone, :finder_email)
            `);

			const resultFinder = stmtFinder.run({
				finder_name: finderName,
				finder_phone: finderPhone,
				finder_email: finderEmail
			});

			finder_id = resultFinder.lastInsertRowid;
		} else {
			const stmtUpdateFinder = db.prepare(`
				UPDATE finders
				SET finder_name = :finder_name,
					finder_phone = :finder_phone
				WHERE finder_id = :finder_id
			`);
			stmtUpdateFinder.run({
				finder_name: finderName,
				finder_phone: finderPhone,
				finder_id: finder_id
			});
		}

		const stmtSighting = db.prepare(`
            INSERT INTO sightings (sighting_location, sighting_description, sighting_image, finder_id, pet_id)
            VALUES (:sighting_location, :sighting_description, :sighting_image, :finder_id, :pet_id)
        `);

		const resultSighting = stmtSighting.run({
			sighting_location: sightingLocation,
			sighting_description: sightingDescription,
			sighting_image: imageBuffer,
			finder_id: finder_id,
			pet_id: petId
		});

		db.exec("COMMIT");

		return {
			sighting_id: resultSighting.lastInsertRowid,
			finder_id
		};

	} catch (err) {
		db.exec("ROLLBACK");
		throw err;
	}
};


const sightingsModel = { postSighting };
export default sightingsModel;