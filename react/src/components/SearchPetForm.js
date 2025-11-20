import Button from "./Button";
import { Input } from "./Input";
import { Radio } from "./Radio";

export function SearchPetForm({ handleSubmit, searchForm, setSearchForm }) {

	const { pet_name, species, breed, color, sex, birth_date, lost_date, owner_email } = searchForm;

	return (
		<form onSubmit={handleSubmit}>
			<h2>Search Lost Pets</h2>
			<Input label="Pet Name" type="text" placeholder="Enter pet's name" value={pet_name} onChange={(e) => setSearchForm({ ...searchForm, pet_name: e.target.value })} />
			<Input label="Species" type="text" placeholder="Enter pet's species" value={species} onChange={(e) => setSearchForm({ ...searchForm, species: e.target.value })} />
			<Input label="Breed" type="text" placeholder="Enter pet's breed" value={breed} onChange={(e) => setSearchForm({ ...searchForm, breed: e.target.value })} />
			<Input label="Color" type="text" placeholder="Enter pet's color" value={color} onChange={(e) => setSearchForm({ ...searchForm, color: e.target.value })} />
			<Radio label="Sex" value={sex} onChange={(e) => setSearchForm({ ...searchForm, sex: e.target.value })} dataSet={[
				{ id: "male", name: "sex", value: "male", label: "Male" },
				{ id: "female", name: "sex", value: "female", label: "Female" },
				{ id: "unknown", name: "sex", value: "unknown", label: "Unknown" }
			]} />
			<Input label="Birth Date" type="date" placeholder="Select birth date" value={birth_date} onChange={(e) => setSearchForm({ ...searchForm, birth_date: e.target.value })} />
			<Input label="Date Lost" type="date" placeholder="Select date lost" value={lost_date} onChange={(e) => setSearchForm({ ...searchForm, lost_date: e.target.value })} />
			<Input label="Owner Email" type="email" placeholder="Enter owner's email" value={owner_email} onChange={(e) => setSearchForm({ ...searchForm, owner_email: e.target.value })} />
			<div className="form-actions">
				<Button type="submit" label="Submit" additionalClass="secondary" onClick={() => { }} />
			</div>
		</form>
	);
}