import { db } from "../app.js";

const getFinderByEmail = async (email) => {

	try {
		let sql = `
			SELECT *
			FROM finders
			WHERE finder_email = ?
		`;

		const owner = db.prepare(sql).get(email);

		return owner || null;
	} catch (error) {
		console.error(`Error fetching Finder with email ${email}:`, error);
		throw error;
	}
};

const findersModel = { getFinderByEmail };
export default findersModel;