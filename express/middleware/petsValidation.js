export const petsValidation = (req, res, next) => {
	const {
		petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		dateLost,
		ownerEmail,
		image,
		description
	} = req.body;

	const errors = {};

	if (!petName || petName.trim() === '') {
		errors.petName = 'Pet name is required.';
	}

	if (!species || species.trim() === '') {
		errors.species = 'Species is required.';
	}

	if (!breed || breed.trim() === '') {
		errors.breed = 'Breed is required.';
	}

	if (!color || color.trim() === '') {
		errors.color = 'Color is required.';
	}

	if (!sex || !['male', 'female', 'unknown'].includes(sex)) {
		errors.sex = 'Sex must be one of "male", "female", or "unknown".';
	}

	if (birthDate && (new Date(birthDate) > new Date())) {
		errors.birthDate = 'Birth date cannot be in the future.';
	} else if (birthDate && dateLost && (new Date(birthDate) > new Date(dateLost))) {
		errors.birthDate = 'Birth date cannot be after date lost.';
	}

	if (!dateLost || isNaN(Date.parse(dateLost))) {
		errors.dateLost = 'Valid date lost is required.';
	}else if (new Date(dateLost) > new Date()) {
		errors.dateLost = 'Date lost cannot be in the future.';
	}

	if (!ownerEmail || color.trim() === '') {
		errors.ownerEmail = 'Valid owner email is required.';
	}

	if (!image || image.trim() === '') {
		errors.image = 'Image cannot be an empty string.';
	}

	if (!description || description.trim() === '') {
		errors.description = 'Description cannot be empty.';
	}
	
	if (Object.keys(errors).length > 0) {
		return res.status(400).json({ errors });
	}

	next();
}