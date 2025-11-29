export const petsValidation = (req, res, next) => {
	const {
		petName,
		species,
		breed,
		color,
		sex,
		birthDate,
		dateLost,
		image,
		description,
		ownerEmail,
		ownerName,
		ownerPhone,
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
	} else if (new Date(dateLost) > new Date()) {
		errors.dateLost = 'Date lost cannot be in the future.';
	}

	if (!ownerEmail || ownerEmail.trim() === '') {
		errors.ownerEmail = 'Valid owner email is required.';
	}

	if (!image) {
		errors.image = 'Image is required.';
	} else {
		const base64Data = image.includes(',') ? image.split(',')[1] : image;
		const imageSizeInBytes = (base64Data.length * 3) / 4;

		const MAX_SIZE = 200 * 1024;
		if (imageSizeInBytes > MAX_SIZE) {
			errors.image = 'Image size cannot exceed 200KB.';
		}
	}

	if (!description || description.trim() === '') {
		errors.description = 'Description cannot be empty.';
	}

	if (!ownerName || ownerName.trim() === '') {
		errors.ownerName = 'Owner name is required.';
	}

	if (!ownerPhone || ownerPhone.trim() === '') {
		errors.ownerPhone = 'Owner phone is required.';
	}

	if (!ownerEmail || ownerEmail.trim() === '') {
		errors.ownerEmail = 'Owner email is required.';
	}

	if (Object.keys(errors).length > 0) {
		return res.status(400).json({ errors });
	}

	next();
}