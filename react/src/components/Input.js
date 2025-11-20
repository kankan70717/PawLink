export function Input({ label, type, value, onChange, placeholder, errorMessage, preview }) {
	return (
		<div className="input-group">
			<label htmlFor={label}>{label}</label>
			{type === 'file' ? (
				<div className="file-input-container">
					<input
						accept="image/*"
						type="file"
						onChange={onChange} />
					{preview && <img src={preview} alt="Preview" className="preview-img" />}
					{errorMessage && <span className="error-message">{errorMessage}</span>}
				</div>
			) : (
				<div className="input-container">
					<input
						type={type}
						value={value}
						onChange={onChange}
						placeholder={placeholder}
					/>
					{errorMessage && <span className="error-message">{errorMessage}</span>}
				</div>
			)}
		</div>
	);
}
