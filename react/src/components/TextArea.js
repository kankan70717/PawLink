export function TextArea({ label, value, onChange, placeholder }) {
	return (
		<>
			<label htmlFor={label}>{label}</label>
			<textarea
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		</>
	);
}