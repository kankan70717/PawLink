const Button = ({ type = "button", label, additionalClass, onClick }) => {
	return (
		<button type={type} className={`custom-button ${additionalClass}`} onClick={onClick}>
			<span>{label}</span>
		</button>
	);
};

export default Button;
