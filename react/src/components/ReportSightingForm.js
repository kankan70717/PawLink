import { useState } from "react";
import { Input } from "./Input";
import { TextArea } from "./TextArea";
import Button from "./Button";
import { Radio } from "./Radio";

const ReportSightingForm = ({ petId }) => {

	const [sightingLocation, setSightingLocation] = useState("");
	const [sightingDescription, setSightingDescription] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [errorPetsMessage, setErrorPetsMessage] = useState({});

	const [finder, setFinder] = useState('newFinder');
	const [finderID, setFinderID] = useState('');
	const [finderName, setFinderName] = useState('');
	const [finderPhone, setFinderPhone] = useState('');
	const [finderEmail, setFinderEmail] = useState('');
	const [errorFinderMessage, setErrorFinderMessage] = useState('');

	const searchFinderByEmail = async (email) => {
		try {
			const res = await fetch(`/api/v1/finders/info?email=${encodeURIComponent(email)}`);
			const json = await res.json();
			console.log("Finder search response:", json);

			if (res.ok) {
				const finder = json.data;

				setFinderName(finder.finder_name);
				setFinderPhone(finder.finder_phone);
				setFinderID(finder.finder_id);
				setErrorFinderMessage('');
			} else {
				setFinderID('');
				setErrorFinderMessage(json.message);
				setFinderName('');
				setFinderPhone('');
			}
		} catch (error) {
			console.error("Error searching finder by email:", error);
		}
	};

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
			const res = await fetch('/api/v1/sightings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sightingLocation,
					sightingDescription,
					image: base64Image || null,
					finderID,
					finderName,
					finderPhone,
					finderEmail,
					petId
				}),
			});

			const data = await res.json();

			if (res.ok) {
				console.log('Sighting reported successfully:', data);
			} else {
				setErrorPetsMessage(data.errors);
			}

		} catch (error) {
			console.error("Error reporting sighting:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Report Sighting</h2>
			<Input
				label="Sighting Photo"
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
			<Input label="Sighting Location" type="text" placeholder="Enter sighting location" value={sightingLocation} onChange={(e) => setSightingLocation(e.target.value)} errorMessage={errorPetsMessage.sightingLocation} />
			<TextArea label="Sighting Description" placeholder="Enter sighting description" value={sightingDescription} onChange={(e) => setSightingDescription(e.target.value)} errorMessage={errorPetsMessage.description} />

			<div className="finder-info">
				<h3>Finder Info</h3>
				<Radio value={finder} onChange={(e) => {
					setFinder(e.target.value);
					setFinderName('');
					setFinderPhone('');
					setFinderEmail('');
					setErrorFinderMessage('');
				}}
					dataSet={[
						{ id: "new", name: "newFinder", value: "newFinder", label: "New Finder" },
						{ id: "existing", name: "existingFinder", value: "existingFinder", label: "Existing Finder" }
					]}
					errorMessage={errorPetsMessage.sex} />
				<Input label="Finder Email*" type="email" placeholder="Enter Finder's email" value={finderEmail} onChange={(e) => setFinderEmail(e.target.value)} />
				{
					finder === 'newFinder'
						?
						<>
							<Input label="Finder Name" type="text" placeholder="Enter Finder's name" value={finderName} onChange={(e) => setFinderName(e.target.value)} />
							<Input label="Finder Phone" type="text" placeholder="Enter Finder's phone number" value={finderPhone} onChange={(e) => setFinderPhone(e.target.value)} />
						</>
						:
						<>
							<div>
								<button type="button" label="Search by Email" className="search-btn" onClick={() => searchFinderByEmail(finderEmail)}>Search by Email</button></div>
							{
								finderName !== '' &&
								<>
									<Input label="Finder Name" type="text" placeholder="Enter Finder's name" value={finderName} onChange={(e) => setFinderName(e.target.value)} />
									<Input label="Finder Phone" type="text" placeholder="Enter Finder's phone number" value={finderPhone} onChange={(e) => setFinderPhone(e.target.value)} />
								</>
							}
							{
								errorFinderMessage &&
								<p className="Finder-error-message">{errorFinderMessage}</p>
							}
						</>
				}
			</div>

			<div className="form-actions">
				<Button type="submit" label="Submit" additionalClass="secondary" onClick={() => { }} />
			</div>
		</form>
	);
};

export default ReportSightingForm;