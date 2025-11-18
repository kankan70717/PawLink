export function Input({ label, type, value, onChange, placeholder }) {
	return (
		<>
			<label htmlFor={label}>{label}</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</>
	);
}