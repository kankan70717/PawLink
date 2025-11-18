export function TextArea({ label, value, onChange, placeholder, errorMessage }) {
	return (
		<div className="input-group">
			<label htmlFor={label}>{label}</label>
			<div className="input-container">
				<textarea
					value={value}
					onChange={onChange}
					placeholder={placeholder}
				/>
				{errorMessage && <span className="error-message">{errorMessage}</span>}
			</div>
		</div>
	);
}