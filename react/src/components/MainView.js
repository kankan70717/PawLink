import { useEffect, useState } from "react";
import PetList from "./PetList";
import Button from "./Button";

const MainView = ({ setCurrentPage, setVisiblePetDetails }) => {
	const [lostAndMatchedPetsNumber, setLostAndMatchedPetsNumber] = useState([]);
	const [lostPets, setLostPets] = useState([]);
	console.log("Lost and Matched Pets Number:", lostAndMatchedPetsNumber);
	console.log("Lost Pets:", lostPets);

	useEffect(() => {

		const fetchLostAndMatchedPetsNumber = async () => {
			try {
				const queryParams = new URLSearchParams({
					startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0],
				});
				console.log("Query Params:", queryParams.toString());
				const response = await fetch(`/api/v1/pets/lost-matched/number?${queryParams.toString()}`);
				const { message, data } = await response.json();
				setLostAndMatchedPetsNumber(data);
				console.log(message, data);

			} catch (error) {
				console.error("Error fetching found pets:", error);
			}
		}

		const fetchLostPets = async () => {
			try {
				const response = await fetch("/api/v1/pets/lost?days=30&limit=3&offset=0");
				const { message, data } = await response.json();
				setLostPets(data);
				console.log(message, data);

			} catch (error) {
				console.error("Error fetching lost pets:", error);
			}
		}

		fetchLostAndMatchedPetsNumber();
		fetchLostPets();
	}, []);

	return (
		<div className="mv">
			<div className="mv-inner">
				<div className="mv-welcome-message">
					<h2>Find & Report<br />Lost Pets</h2>
					<h3>Welcome to the Lost Pet Finder App</h3>
				</div>
				<div className="mv-status">
					<div className="mv-found">
						<h3>
							<div className="big">Number of pets found</div>
							<div>in the last 30 days</div>
						</h3>
						<p>
							<span className="big">{lostAndMatchedPetsNumber?.find(r => r.status === 'matched')?.count} </span>
							pets found
						</p>
					</div>
					<div className="mv-lost">
						<h3>
							<div className="big">Number of pets lost</div>
							<div>in the last 30 days</div>
						</h3>
						<p>
							<span className="big">{lostAndMatchedPetsNumber?.find(r => r.status === 'lost')?.count} </span>
							pets lost
						</p>
					</div>
				</div>
			</div>
			<PetList pets={lostPets} listName="Recently Lost Pets in Last 30 Days" setVisiblePetDetails={setVisiblePetDetails} />
			<div>
				<Button label="See More" additionalClass="secondary" onClick={() => { setCurrentPage("search_for_lost_pet"); }} />
			</div>
		</div>
	);
};

export default MainView;
