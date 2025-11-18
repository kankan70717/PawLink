const Button = ({ label, additionalClass, onClick }) => {
	return (
		<button className={`custom-button ${additionalClass}`} onClick={onClick}>
			<span>{label}</span>
		</button>
	);
};

export default Button;
