import { useEffect, useState } from "react";
import PetList from "./PetList";

const MainView = () => {
	const [foundPets, setFoundPets] = useState([]);
	const [lostPets, setLostPets] = useState([]);
	console.log("Found Pets:", foundPets);
	console.log("Lost Pets:", lostPets);

	useEffect(() => {

		const fetchFoundPets = async () => {
			try {
				const response = await fetch("/api/pets/found?days=30");
				const { message, data } = await response.json();
				setFoundPets(data);
				console.log(message, data);

			} catch (error) {
				console.error("Error fetching found pets:", error);
			}
		}

		const fetchLostPets = async () => {
			try {
				const response = await fetch("/api/pets/lost?days=30");
				const { message, data } = await response.json();
				setLostPets(data);
				console.log(message, data);

			} catch (error) {
				console.error("Error fetching lost pets:", error);
			}
		}

		fetchFoundPets();
		fetchLostPets();
	}, []);

	return (
		<div className="mv">
			<div className="mv-inner">
				<div className="mv-welcome-message">
					<h2>Find & Report<br />Lost Pets</h2>
					<h3>Welcome to the Lost Pet Finder App</h3>
				</div>
				<div className="mv-found">
					<h3>
						<div className="big">Number of pets found</div>
						<div>in the last 30 days</div>
					</h3>
					<p>
						<span className="big">{foundPets.length} </span>
						pets found
					</p>
				</div>
			</div>
			<PetList pets={lostPets} listName="Recently Lost Pets in Last 30 Days" />
		</div>
	);
};

export default MainView;
