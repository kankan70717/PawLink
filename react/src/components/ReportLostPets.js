import { useState } from "react";
import { LostPetForm } from "./LostPetForm";
import { Submittion } from "./Submittion";

const ReportLostPets = () => {
	const [reportStatus, setReportStatus] = useState(undefined);

	return (
		<div>
			{
				reportStatus === 'success'
					? <Submittion title="Your Lost Pet Report Submitted Successfully" sentence="I hope you find your pet soon,,," />
					: reportStatus === undefined
						? <LostPetForm setReportStatus={setReportStatus} />
						: reportStatus === 'error'
							? <p>There was an error submitting the lost pet report. Please try again.</p>
							: null
			}


		</div>
	);
};

export default ReportLostPets;
