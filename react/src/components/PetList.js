import PetCard from "./PetCard";

const PetList = (props) => {
	const { pets, listName, setVisiblePetDetails } = props;

	return (
		<div className="pet-list">
			<h2>{listName}</h2>
			{pets.map((pet, index) => (
				<PetCard key={index} pet={pet} setVisiblePetDetails={setVisiblePetDetails} />
			))}
		</div>
	);
}

export default PetList;