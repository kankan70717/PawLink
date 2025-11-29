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
	const [preview, setPreview] = useState(petDetails?.image ? petDetails.image : '');
	const [imageFile, setImageFile] = useState(null);
	const [description, setDescription] = useState(petDetails?.description ? petDetails.description : '');
	const [status, setStatus] = useState(petDetails?.status ? petDetails.status : 'lost');
	const [errorPetsMessage, setErrorPetsMessage] = useState({});

	const [owner, setOwner] = useState('newOwner');
	const [ownerID, setOwnerID] = useState(petDetails?.owner?.id ? petDetails.owner.id : '');
	const [ownerName, setOwnerName] = useState(petDetails?.owner?.name ? petDetails.owner.name : '');
	const [ownerPhone, setOwnerPhone] = useState(petDetails?.owner?.phone ? petDetails.owner.phone : '');
	const [ownerEmail, setOwnerEmail] = useState(petDetails?.owner?.email ? petDetails.owner.email : '');

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
						image: base64Image || petDetails?.image || null,
						description,
						ownerID,
						ownerEmail,
						ownerName,
						ownerPhone
					}),
				});

				const data = await res.json();

				if (res.ok) {
					console.log('Lost pet report updated successfully:', data);
					setReportStatus('success');
				} else {
					setErrorPetsMessage(data.errors);
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
						ownerID,
						ownerEmail,
						ownerName,
						ownerPhone,
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
					setErrorPetsMessage(data.errors);
				}
			}
		} catch (error) {
			setReportStatus('error');
			console.error('Error submitting lost pet report:', error);
		}
	};

	const searchOwnerByEmail = async (email) => {
		try {
			const res = await fetch(`/api/owners/info?email=${encodeURIComponent(email)}`);
			const data = await res.json();

			if (res.ok) {
				const { owner_id, owner_name, owner_phone, owner_email } = data.data;

				setOwnerID(owner_id || '');
				setOwnerEmail(owner_email || '');
				setOwnerName(owner_name || '');
				setOwnerPhone(owner_phone || '');
				setErrorPetsMessage({});
				
				return data.data;
			} else if (!res.ok || !data.data) {
				setOwnerName('');
				setOwnerPhone('');
				setOwnerEmail('');
				setErrorPetsMessage({ ownerEmail: 'Owner not found with this email' });
				return null;
			}

		} catch (error) {
			console.error('Error fetching owner info:', error);
			return null;
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>{title}</h2>
			<Input label="Pet Name*" type="text" placeholder="Enter pet's name" value={petName} onChange={(e) => setPetName(e.target.value)} errorMessage={errorPetsMessage.petName} />
			<Input label="Species*" type="text" placeholder="Enter pet's species" value={species} onChange={(e) => setSpecies(e.target.value)} errorMessage={errorPetsMessage.species} />
			<Input label="Breed*" type="text" placeholder="Enter pet's breed" value={breed} onChange={(e) => setBreed(e.target.value)} errorMessage={errorPetsMessage.breed} />
			<Input label="Color*" type="text" placeholder="Enter pet's color" value={color} onChange={(e) => setColor(e.target.value)} errorMessage={errorPetsMessage.color} />
			<Radio label="Sex*" value={sex} onChange={(e) => setSex(e.target.value)} dataSet={[
				{ id: "male", name: "sex", value: "male", label: "Male" },
				{ id: "female", name: "sex", value: "female", label: "Female" },
				{ id: "unknown", name: "sex", value: "unknown", label: "Unknown" }
			]} errorMessage={errorPetsMessage.sex} />
			<Input label="Birth Date" type="date" placeholder="Select birth date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
			<Input label="Date Lost*" type="date" placeholder="Select date lost" value={dateLost} onChange={(e) => setDateLost(e.target.value)} errorMessage={errorPetsMessage.dateLost} />
			<Input
				label="Photo*"
				type="file"
				placeholder="Choose a photo"
				preview={preview}
				errorMessage={errorPetsMessage.image}
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
			<TextArea label="Description*" placeholder="Enter pet's description" value={description} onChange={(e) => setDescription(e.target.value)} errorMessage={errorPetsMessage.description} />
			{
				action === 'edit' &&
				<Radio label="Status*" value={status} onChange={(e) => setStatus(e.target.value)} dataSet={[
					{ id: "lost", name: "status", value: "lost", label: "Lost" },
					{ id: "matched", name: "status", value: "matched", label: "Matched" }
				]} errorMessage={errorPetsMessage.status} />
			}


			<div className="owner-info">
				<h3>Owner Info</h3>
				{
					action !== 'edit' &&
					<Radio value={owner} onChange={(e) => {
						setOwner(e.target.value);
						setOwnerName('');
						setOwnerPhone('');
						setOwnerEmail('');
						setErrorPetsMessage({});
					}}
						dataSet={[
							{ id: "new", name: "newOwner", value: "newOwner", label: "New Owner" },
							{ id: "existing", name: "existingOwner", value: "existingOwner", label: "Existing Owner" }
						]}
						errorMessage={errorPetsMessage.sex} />
				}

				<Input label="Owner Email*" type="email" placeholder="Enter owner's email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} errorMessage={errorPetsMessage.ownerEmail} />
				{
					owner === 'newOwner'
						?
						<>
							<Input label="Owner Name" type="text" placeholder="Enter owner's name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} errorMessage={errorPetsMessage.ownerName} />
							<Input label="Owner Phone" type="text" placeholder="Enter owner's phone number" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} errorMessage={errorPetsMessage.ownerPhone} />
						</>
						:
						<>
							<div>
								<button type="button" label="Search by Email" className="search-btn" onClick={() => searchOwnerByEmail(ownerEmail)}>Search by Email</button></div>
							{ownerName !== '' &&
								<>
									<Input label="Owner Name" type="text" placeholder="Enter owner's name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} errorMessage={errorPetsMessage.ownerName} />
									<Input label="Owner Phone" type="text" placeholder="Enter owner's phone number" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} errorMessage={errorPetsMessage.ownerPhone} />
								</>
							}
						</>
				}
			</div>

			<div className="form-actions">
				<Button type="submit" label="Submit" additionalClass="secondary" onClick={handleSubmit} />
			</div>
		</form>
	);
}