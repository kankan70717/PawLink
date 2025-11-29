import { db } from "../app.js";

const getOwnerByEmail = async (email) => {

	try {
		let sql = `
			SELECT *
			FROM owners
			WHERE owner_email = ?
		`;

		const owner = db.prepare(sql).get(email);

		return owner || null;
	} catch (error) {
		console.error(`Error fetching owner with email ${email}:`, error);
		throw error;
	}
};

const ownersModel = { getOwnerByEmail };
export default ownersModel;