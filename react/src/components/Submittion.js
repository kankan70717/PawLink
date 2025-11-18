import Button from "./Button";

export function Submittion({ title, sentence }) {
	return (
		<div className="submittion">
			<h2>{title}</h2>
			<p>{sentence}</p>
			<div className="form-actions">
				<Button type="button" label="Go to Home" additionalClass="secondary" onClick={() => { window.location.href = '/'; }} />
			</div>
		</div>
	);
}