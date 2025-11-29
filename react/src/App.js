import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainView from "./components/MainView";
import ReportLostPets from "./components/ReportLostPets";
import SearchPets from "./components/SearchPets";
import { PetDetails } from "./components/PetDetails";

export const App = () => {
	const [currentPage, setCurrentPage] = useState("home");
	const [visiblePetDetails, setVisiblePetDetails] = useState({ pet_id: null, isVisible: false });

	return (
		<div className="base-layout">
			<Header setCurrentPage={setCurrentPage} currentPage={currentPage} />
			{
				currentPage === "home"
					? <MainView setCurrentPage={setCurrentPage} setVisiblePetDetails={setVisiblePetDetails} />
					: currentPage === "report_lost_pet"
						? <ReportLostPets />
						: currentPage === "search_for_lost_pet"
							? <SearchPets setVisiblePetDetails={setVisiblePetDetails} />
							: null
			}
			{visiblePetDetails.isVisible && <PetDetails id={visiblePetDetails.pet_id} setVisiblePetDetails={setVisiblePetDetails} />}
			<Footer />
		</div>
	);
}