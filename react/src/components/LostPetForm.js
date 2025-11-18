import { useState } from "react";
import Button from "./Button";
import { Input } from "./Input";
import { Radio } from "./Radio";
import { TextArea } from "./TextArea";

export function LostPetForm( { setReportStatus } ) {
	const [petName, setPetName] = useState('');
	const [species, setSpecies] = useState('');
	const [breed, setBreed] = useState('');
	const [color, setColor] = useState('');
	const [sex, setSex] = useState('male');
	const [birthDate, setBirthDate] = useState('');
	const [dateLost, setDateLost] = useState('');
	const [ownerEmail, setOwnerEmail] = useState('');
	const [image, setImage] = useState('');
	const [description, setDescription] = useState('');
	const [errorMessage, setErrorMessage] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Submitting lost pet report:', {
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
		});
		try {
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
					image,
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
				setImage('');
				setDescription('');
			} else {
				setErrorMessage(data.errors);
			}

		} catch (error) {
			setReportStatus('error');
			console.error('Error submitting lost pet report:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Report Lost Pets</h2>
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
			<Input label="Photo*" type="text" placeholder="Enter photo URL" value={image} onChange={(e) => setImage(e.target.value)} errorMessage={errorMessage.photo} />
			<TextArea label="Description*" placeholder="Enter pet's description" value={description} onChange={(e) => setDescription(e.target.value)} errorMessage={errorMessage.description} />
			<div className="form-actions">
				<Button type="submit" label="Submit" additionalClass="secondary" onClick={() => { }} />
			</div>
		</form>
	);
}