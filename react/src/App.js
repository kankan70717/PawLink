import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainView from "./components/MainView";
import ReportLostPets from "./components/ReportLostPets";
import SearchPets from "./components/SearchPets";

export const App = () => {
	const [currentPage, setCurrentPage] = useState("home");

	return (
		<div className="base-layout">
			<Header setCurrentPage={setCurrentPage} />

			{currentPage === "home"
				? <MainView />
				: currentPage === "report_lost_pet"
					? <ReportLostPets />
					: currentPage === "search_for_lost_pet"
						? <SearchPets />
						: null}
			<Footer />
		</div>
	);
}