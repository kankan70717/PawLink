import Button from "./Button";

const Header = ({ setCurrentPage, currentPage }) => {
	return (
		<header>
			<h1 onClick={()=>setCurrentPage("home")}>PawLink</h1>
			<Button
				type="button"
				label="Home"
				additionalClass={`primary ${currentPage === "home" ? "current" : ""}`}
				onClick={() => setCurrentPage("home")}
			/>
			<Button
				type="button"
				label="Report a Lost Pet"
				additionalClass={`primary ${currentPage === "report_lost_pet" ? "current" : ""}`}
				onClick={() => setCurrentPage("report_lost_pet")}
			/>
			<Button
				type="button"
				label="Search for a Lost Pet"
				additionalClass={`primary ${currentPage === "search_for_lost_pet" ? "current" : ""}`}
				onClick={() => setCurrentPage("search_for_lost_pet")}
			/>
		</header>
	);
}
export default Header;