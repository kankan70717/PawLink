export function Radio({ label, dataSet, value, onChange }) {
	return (
		<>
			<label>{label}</label>
			<div className="radio-set">
				{
					dataSet.map((data) => (
						<label key={data.id}>
							<input
								type="radio"
								id={data.id}
								name={data.name}
								value={data.value}
								onChange={onChange}
								checked={data.value === value}
							/>
							<span htmlFor={data.id}>{data.label}</span>
						</label>
					))
				}
			</div>
		</>
	);
}