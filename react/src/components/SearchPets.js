import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PetList from "./PetList";
import { SearchPetForm } from "./SearchPetForm";

const SearchPets = ({ setVisiblePetDetails }) => {

	const [fetchAvailable, setFetchAvailable] = useState(false);
	const [lostPets, setLostPets] = useState([]);
	const [lostPetsNumber, setLostPetsNumber] = useState(0);
	const [page, setPage] = useState(1);
	const [searchForm, setSearchForm] = useState({
		pet_name: '',
		species: '',
		breed: '',
		color: '',
		sex: 'male',
		birth_date: '',
		lost_date: '',
		owner_email: ''
	});

	useEffect(() => {
		const fetchLostPetsNumber = async () => {
			try {
				const response = await fetch("/api/v1/pets/lost/number");
				const { message, data } = await response.json();
				console.log(message, data);
				setLostPetsNumber(data);

			} catch (error) {
				console.error("Error fetching lost pets number:", error);
			}
		}
		fetchLostPetsNumber();
	}, []);

	useEffect(() => {
		if (!fetchAvailable) {
			return;
		}
		fetchLostPets(page);
	}, [page]);

	const createQueryString = (searchForm, pageNumber) => {
		const queryParams = new URLSearchParams();
		if (searchForm.pet_name) queryParams.append('pet_name', searchForm.pet_name);
		if (searchForm.species) queryParams.append('species', searchForm.species);
		if (searchForm.breed) queryParams.append('breed', searchForm.breed);
		if (searchForm.color) queryParams.append('color', searchForm.color);
		if (searchForm.sex) queryParams.append('sex', searchForm.sex);
		if (searchForm.birth_date) queryParams.append('birth_date', searchForm.birth_date);
		if (searchForm.lost_date) queryParams.append('lost_date', searchForm.lost_date);
		if (searchForm.owner_email) queryParams.append('owner_email', searchForm.owner_email);

		queryParams.append('limit', 9);
		queryParams.append('offset', (pageNumber - 1) * 9);

		return queryParams.toString();
	}

	const fetchLostPets = async (pageNumber = page) => {
		try {
			const queryParams = createQueryString(searchForm, pageNumber);
			const response = await fetch(`/api/v1/pets/lost?${queryParams}`);
			const { message, data } = await response.json();
			console.log(message, data);
			setLostPets(data);
		} catch (error) {
			console.error("Error fetching lost pets:", error);
		}
	};


	const handleSubmit = async (e) => {
		if (e) {
			e.preventDefault();
		}

		setFetchAvailable(true);
		setPage(1);
		fetchLostPets(1);
	};

	return (
		<div>
			<SearchPetForm handleSubmit={handleSubmit} searchForm={searchForm} setSearchForm={setSearchForm} />
			{
				lostPets.length > 0 &&
				<>
					<PetList pets={lostPets} listName="Lost Pets List" setVisiblePetDetails={setVisiblePetDetails} />
					<div className="pagenation">
						{
							page > 1 &&
							<div className="pagenation-arrow">
								<IoIosArrowBack onClick={() => setPage(page - 1)} />
							</div>
						}
						{
							<span>{`Page ${page}`}</span>
						}
						{
							(page * 9) < lostPetsNumber &&
							<div className="pagenation-arrow">
								<IoIosArrowForward onClick={() => setPage(page + 1)} />
							</div>
						}
					</div>
				</>
			}
		</div>
	);
};

export default SearchPets;
