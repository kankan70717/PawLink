import { useState } from "react";
import Button from "./Button";
import { Input } from "./Input";
import { Radio } from "./Radio";
import { TextArea } from "./TextArea";

export function LostPetForm({ setReportStatus, petDetails, title, action }) {
	const [petName, setPetName] = useState(petDetails?.pet_name ? petDetails.pet_name : '');
	const [species, setSpecies] = useState(petDetails?.species ? petDetails.species : '');
	const [breed, setBreed] = useState(petDetails?.breed ? petDetails.breed : '');
	const [color, setColor] = useState(petDetails?.color ? petDetails.color : '');
	const [sex, setSex] = useState(petDetails?.sex ? petDetails.sex : 'male');
	const [birthDate, setBirthDate] = useState(petDetails?.birth_date ? petDetails.birth_date : '');
	const [dateLost, setDateLost] = useState(petDetails?.lost_date ? petDetails.lost_date : '');
	const [ownerEmail, setOwnerEmail] = useState(petDetails?.owner_email ? petDetails.owner_email : '');
	const [preview, setPreview] = useState(petDetails?.image ? petDetails.image : '');
	const [imageFile, setImageFile] = useState(null); const [description, setDescription] = useState(petDetails?.description ? petDetails.description : '');
	const [errorMessage, setErrorMessage] = useState({});

	console.log('form', petName, species, breed, color, sex, birthDate, dateLost, ownerEmail, description);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let base64Image = null;

		if (imageFile) {
			base64Image = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(imageFile);
			});
		}

		try {
			if (action === 'edit') {
				const res = await fetch(`/api/pets/lost/${petDetails.pet_id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						petName,
						species,
						breed,
						color,
						sex,
						birthDate,
						dateLost,
						ownerEmail,
						image: base64Image || petDetails?.image || null,
						description
					}),
				});

				const data = await res.json();

				if (res.ok) {
					console.log('Lost pet report updated successfully:', data);
					setReportStatus('success');
				} else {
					setErrorMessage(data.errors);
				}
				return;

			} else {
				const res = await fetch('/api/pets/lost', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						petName,
						species,
						breed,
						color,
						sex,
						birthDate,
						dateLost,
						ownerEmail,
						image: base64Image,
						description
					}),
				});

				const data = await res.json();

				if (res.ok) {
					console.log('Lost pet report submitted successfully:', data);
					setReportStatus('success');
					setPetName('');
					setSpecies('');
					setBreed('');
					setColor('');
					setSex('male');
					setBirthDate('');
					setDateLost('');
					setOwnerEmail('');
					setPreview(null);
					setImageFile(null);
					setDescription('');
				} else {
					setErrorMessage(data.errors);
				}
			}
		} catch (error) {
			setReportStatus('error');
			console.error('Error submitting lost pet report:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>{title}</h2>
			<Input label="Pet Name*" type="text" placeholder="Enter pet's name" value={petName} onChange={(e) => setPetName(e.target.value)} errorMessage={errorMessage.petName} />
			<Input label="Species*" type="text" placeholder="Enter pet's species" value={species} onChange={(e) => setSpecies(e.target.value)} errorMessage={errorMessage.species} />
			<Input label="Breed*" type="text" placeholder="Enter pet's breed" value={breed} onChange={(e) => setBreed(e.target.value)} errorMessage={errorMessage.breed} />
			<Input label="Color*" type="text" placeholder="Enter pet's color" value={color} onChange={(e) => setColor(e.target.value)} errorMessage={errorMessage.color} />
			<Radio label="Sex*" value={sex} onChange={(e) => setSex(e.target.value)} dataSet={[
				{ id: "male", name: "sex", value: "male", label: "Male" },
				{ id: "female", name: "sex", value: "female", label: "Female" },
				{ id: "unknown", name: "sex", value: "unknown", label: "Unknown" }
			]} errorMessage={errorMessage.sex} />
			<Input label="Birth Date" type="date" placeholder="Select birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
			<Input label="Date Lost*" type="date" placeholder="Select date lost" value={dateLost} onChange={(e) => setDateLost(e.target.value)} errorMessage={errorMessage.dateLost} />
			<Input label="Owner Email*" type="email" placeholder="Enter owner's email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} errorMessage={errorMessage.ownerEmail} />
			<Input
				label="Photo*"
				type="file"
				placeholder="Choose a photo"
				preview={preview}
				errorMessage={errorMessage.image}
				onChange={(e) => {
					const file = e.target.files[0];
					if (file) {
						setImageFile(file);

						const reader = new FileReader();
						reader.onload = () => setPreview(reader.result);
						reader.readAsDataURL(file);
					}
				}}
			/>
			<TextArea label="Description*" placeholder="Enter pet's description" value={description} onChange={(e) => setDescription(e.target.value)} errorMessage={errorMessage.description} />
			<div className="form-actions">
				<Button type="submit" label="Submit" additionalClass="secondary" onClick={() => { }} />
			</div>
		</form>
	);
}