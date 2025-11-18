import pets from './animal-control-inventory-lost-and-found.json' with {type: 'json'};
import sqlite3 from "sqlite3";
import fs from "fs";

const db = new sqlite3.Database('data.db');

db.prepare('DELETE FROM finders;').run();
db.prepare('DELETE FROM lost_pets;').run();
db.prepare('DELETE FROM owners;').run();
db.prepare('DELETE FROM sightings;').run();

function randomDate(startDate, endDate) {
	const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
	return date.toISOString().split('T')[0];
};

db.serialize(() => {

	// insert owners table
	const owners = [
		['Benjamin Hall', '+1-123-234-3456', 'benjamin.hall@example.com'],
		['Mia Allen', '+1-234-345-4567', 'mia.allen@example.com'],
		['Lucas Young', '+1-345-456-5678', 'lucas.young@example.com'],
		['Charlotte Hernandez', '+1-456-567-6789', 'charlotte.hernandez@example.com'],
		['Henry King', '+1-567-678-7890', 'henry.king@example.com'],
		['Amelia Wright', '+1-678-789-8901', 'amelia.wright@example.com'],
		['Alexander Scott', '+1-789-890-9012', 'alexander.scott@example.com'],
		['Evelyn Green', '+1-890-901-0123', 'evelyn.green@example.com'],
		['Michael Adams', '+1-901-012-1234', 'michael.adams@example.com'],
		['Harper Baker', '+1-012-123-2345', 'harper.baker@example.com']
	];

	const pets_descriptions=[
		'Small brown dog with a red collar.',
		'Gray tabby cat with green eyes.',
		'Black and white dog, very friendly.',
		'Orange cat with a distinctive white patch on its chest.',
		'Golden retriever, very playful and energetic.',
		'Calico cat, shy but affectionate once approached.',
		'Beagle with a blue collar, loves to sniff around.',
		'Siamese cat with striking blue eyes.',
		'Bulldog, stocky build with a wrinkled face.',
	];

	owners.forEach(owner => {
		db.prepare(`INSERT INTO owners (owner_name, owner_phone, owner_email) VALUES (?, ?, ?);`)
			.run(owner[0], owner[1], owner[2]);
	});

	// insert finders table
	const finders = [
		['Liam Smith', '+1-111-222-3333', 'liam.smith@example.com'],
		['Emma Johnson', '+1-222-333-4444', 'emma.johnson@example.com'],
		['Noah Williams', '+1-333-444-5555', 'noah.williams@example.com'],
		['Olivia Brown', '+1-444-555-6666', 'olivia.brown@example.com'],
		['Elijah Jones', '+1-555-666-7777', 'elijah.jones@example.com'],
		['Ava Garcia', '+1-666-777-8888', 'ava.garcia@example.com'],
		['William Martinez', '+1-777-888-9999', 'william.martinez@example.com'],
		['Sophia Rodriguez', '+1-888-999-0000', 'sophia.rodriguez@example.com'],
		['James Lee', '+1-999-000-1111', 'james.lee@example.com'],
		['Isabella Walker', '+1-000-111-2222', 'isabella.walker@example.com'],
	];

	finders.forEach(finder => {
		db.prepare(`INSERT INTO finders (finder_name, finder_phone, finder_email) VALUES (?, ?, ?);`)
			.run(finder[0], finder[1], finder[2]);
	});

	// insert lost_pets table
	pets.forEach((pet, index) => {

		try {
			const pet_name = pet.name?.toLowerCase() || null;
			const breedStr = pet.breed || "";
			const description = pet.description || pets_descriptions[Math.floor(Math.random() * pets_descriptions.length)];
			const breed = breedStr.toUpperCase().includes("DSH")
				? 'mixed'
				: breedStr.toLowerCase();

			const species = breedStr.toLowerCase().includes("cat")
				? 'cat'
				: breedStr.toLowerCase().includes("dog")
					? 'dog'
					: 'dog';

			const colorStr = pet.color || "";
			const color = colorStr.toLowerCase();

			const sexStr = pet.sex || "unknown";
			const sex = (sexStr.toLowerCase().includes("m"))
				? 'male'
				: (sexStr.toLowerCase().includes("f"))
					? 'female'
					: 'unknown';

			const status = pet.state
				? pet.state.toLowerCase() == 'lost'
					? 'lost'
					: "matched"
				: "matched";

			const birth_date = randomDate(new Date("1999-01-01"), new Date(pet.date));

			const image = index < 14 ? fs.readFileSync("./image/pets-" + index + ".png") : null;

			const owner_id = Math.floor(Math.random() * 10 + 1);

			db.prepare(`INSERT INTO lost_pets (pet_name, image, species, breed, color, sex, birth_date, description, status, lost_date, found_date, owner_id)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`).run(
				pet_name,
				image,
				species,
				breed,
				color,
				sex,
				birth_date, // birth date
				description,
				status,
				pet.date, // lost date
				status == 'matched' ? randomDate(new Date(pet.date), new Date()) : undefined, // matched date
				owner_id
			);
		} catch (error) {
			console.log(error);
		}
	});

	// insert sightings table
	db.all(`SELECT pet_id, lost_date, found_date FROM lost_pets WHERE pet_id <= 13`, [], (err, petsRows) => {
		if (err) reject(err);

		petsRows.forEach((pet, index) => {
			const startDate = new Date(pet.lost_date);
			const endDate = pet.found_date ? new Date(pet.found_date) : new Date();

			const sightingDate = randomDate(startDate, endDate);

			const sightingImage = index < 14 ? fs.readFileSync(`./image/pets-${index}.png`) : null;

			const locations = ["Vancouver", "Burnaby", "Richmond", "Surrey"];
			const sightingLocation = locations[Math.floor(Math.random() * locations.length)];
			const sightingDescription = `I saw similar pet near ${sightingLocation}`;

			const finder_id = Math.floor(Math.random() * 10 + 1);

			db.prepare(`
				INSERT INTO sightings
				(sighting_image, sighting_date, sighting_location, sighting_description, lost_pet_id, finder_id)
				VALUES (?, ?, ?, ?, ?, ?)
			`).run(
				sightingImage,
				sightingDate,
				sightingLocation,
				sightingDescription,
				pet.pet_id,
				finder_id
			);

		});
	});
});
