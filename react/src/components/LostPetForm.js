import { useState } from "react";
import Button from "./Button";
import { Input } from "./Input";
import { Radio } from "./Radio";
import { TextArea } from "./TextArea";

export function LostPetForm() {
	const [petName, setPetName] = useState('');
	const [species, setSpecies] = useState('');
	const [breed, setBreed] = useState('');
	const [color, setColor] = useState('');
	const [sex, setSex] = useState('male');
	const [birthDate, setBirthDate] = useState('');
	const [dateLost, setDateLost] = useState('');
	const [ownerEmail, setOwnerEmail] = useState('');
	const [photo, setPhoto] = useState('');
	const [description, setDescription] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		
		fetch('/api/pets/lost', {
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
				photo,
				description
			}),
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Report Lost Pets</h2>
			<Input label="Pet Name" type="text" placeholder="Enter pet's name" value={petName} onChange={(e) => setPetName(e.target.value)} />
			<Input label="Species" type="text" placeholder="Enter pet's species" value={species} onChange={(e) => setSpecies(e.target.value)} />
			<Input label="Breed" type="text" placeholder="Enter pet's breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
			<Input label="Color" type="text" placeholder="Enter pet's color" value={color} onChange={(e) => setColor(e.target.value)} />
			<Radio label="Sex" value={sex} onChange={(e) => setSex(e.target.value)} dataSet={[
				{ id: "male", name: "sex", value: "male", label: "Male" },
				{ id: "female", name: "sex", value: "female", label: "Female" },
				{ id: "unknown", name: "sex", value: "unknown", label: "Unknown" }
			]} />
			<Input label="Birth Date" type="date" placeholder="Select birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
			<Input label="Date Lost" type="date" placeholder="Select date lost" value={dateLost} onChange={(e) => setDateLost(e.target.value)} />
			<Input label="Owner Email" type="text" placeholder="Enter owner's email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
			<Input label="Photo" type="file" placeholder="Enter photo URL" value={photo} onChange={(e) => setPhoto(e.target.value)} />
			<TextArea label="Description" placeholder="Enter pet's description" value={description} onChange={(e) => setDescription(e.target.value)} />
			<div className="form-actions">
				<Button label="Submit" additionalClass="secondary" onClick={() => { }} />
			</div>
		</form>
	);
}