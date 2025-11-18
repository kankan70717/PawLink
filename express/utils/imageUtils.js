export const getImageURLFromBlob = (imageBlob) => {
	if (!imageBlob) return null;

	const base64 = Buffer.from(imageBlob).toString('base64');
	const imageURL = `data:image/png;base64,${base64}`;

	return imageURL;
};