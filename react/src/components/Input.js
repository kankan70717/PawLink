export function Input({ label, type, value, onChange, placeholder, errorMessage }) {
	return (
		<div className="input-group">
			<label htmlFor={label}>{label}</label>
			<div className="input-container">
				<input
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
				/>
				{errorMessage && <span className="error-message">{errorMessage}</span>}
			</div>
		</div>
	);
}