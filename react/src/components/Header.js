import Button from "./Button";

const Header = ({ setCurrentPage }) => {
	return (
		<header>
			<h1 onClick={()=>setCurrentPage("home")}>PawLink</h1>
			<Button
				label="Report a Lost Pet"
				additionalClass="primary"
				onClick={() => setCurrentPage("report_lost_pet")}
			/>
			<Button
				label="Search for My Lost Pet"
				additionalClass="primary"
				onClick={() => setCurrentPage("search_for_lost_pet")}
			/>
		</header>
	);
}
export default Header;