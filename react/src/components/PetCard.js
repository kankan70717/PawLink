import { CiImageOff } from "react-icons/ci";

const PetCard = (props) => {
	const { pet } = props;

	return (
		<div className="pet-card">
			<div className="card-img">
				{
					pet.image
						? <img src={pet.image} alt={pet.pet_name} />
						: <CiImageOff size={64}/>
				}
			</div>
			<h2 className="pet-name">{pet.pet_name}</h2>
			<p>{pet.description}</p>
		</div>
	);
};

export default PetCard;