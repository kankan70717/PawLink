import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import ReportLostPets from "./ReportLostPets";
import ReportSightingForm from "./ReportSightingForm";
import { CiImageOff } from "react-icons/ci";

export const PetDetails = ({ id, setVisiblePetDetails }) => {
	const [petDetails, setPetDetails] = useState(null);
	const [edit, setEdit] = useState(false);
	const [addSighting, setAddSighting] = useState(false);

	useEffect(() => {
		try {
			const fetchPetDetails = async () => {
				const response = await fetch(`/api/v1/pets/${id}`);
				const { message, data } = await response.json();
				setPetDetails(data);
				console.log(message, data);
			}
			fetchPetDetails();
		} catch (error) {
			console.error("Failed to fetch pet details:", error);
		}
	}, [id]);

	return (
		<div className="pet-details-container">
			<div className="pet-details">
				<div className="pet-details-header">
					<h1>{petDetails?.pet_name}</h1>
					<FaRegEdit className="edit-btn" onClick={() => setEdit(true)} />
					<ImCross onClick={() => setVisiblePetDetails({ pet_id: null, isVisible: false })} />
				</div>
				{
					edit
						? (
							<ReportLostPets petDetails={petDetails} setEdit={setEdit} title={`Edit Lost Pet: ${petDetails?.pet_name}`} action='edit' />)
						: (
							<div className="pet-details-body">
								<div>
									<div className="pet-details-img">
										{
											petDetails?.image
												? <img src={petDetails.image} alt={petDetails.pet_name} />
												: <CiImageOff size={128} />
										}
									</div>

									<div className="row">
										<div className="title">Age:</div>
										<div>{petDetails?.age}</div>
									</div>
									<div className="row">
										<div className="title">Breed:</div>
										<div>{petDetails?.breed}</div>
									</div>
									<div className="row">
										<div className="title">Species:</div>
										<div>{petDetails?.species}</div>
									</div>
									<div className="row">
										<div className="title">Color:</div>
										<div>{petDetails?.color}</div>
									</div>
									<div className="row">
										<div className="title">Description:</div>
										<div>{petDetails?.description}</div>
									</div>
									<div className="row">
										<div className="title">Birth Date:</div>
										<div>{petDetails?.birth_date}</div>
									</div>
									<div className="row">
										<div className="title">Lost Date:</div>
										<div>{petDetails?.lost_date}</div>
									</div>
									<div className="row">
										<div className="title">Found Date:</div>
										<div>{petDetails?.found_date}</div>
									</div>
									<div className="row">
										<div className="title">Owner Name:</div>
										<div>{petDetails?.owner.name}</div>
									</div>
									<div className="row">
										<div className="title">Owner Email:</div>
										<div>{petDetails?.owner.email}</div>
									</div>
									<div className="row">
										<div className="title">Owner Phone:</div>
										<div>{petDetails?.owner.phone}</div>
									</div>
								</div>
								<div>
									<div className="sightings-header">
										<h2>Sightings</h2>
										<button className="add-sighting-btn" onClick={() => setAddSighting(true)}>Report Sighting</button>
									</div>
									{
										addSighting &&
										<ReportSightingForm petId={petDetails.pet_id} />
									}
									{
										!addSighting && petDetails?.sightings.length > 0 ? petDetails.sightings.map(sighting => (
											<div key={sighting.sighting_id} className="sighting-card">

												<div className="sighting-img">
													{
														sighting.sighting_image ?
															<img src={sighting.sighting_image} alt={`Sighting ${sighting.sighting_id}`} />
															: <CiImageOff size={64} />
													}
												</div>

												<div>
													<div className="row">
														<div className="title">Date:</div>
														<div>{sighting.sighting_date}</div>
													</div>
													<div className="row">
														<div className="title">Location:</div>
														<div>{sighting.sighting_location}</div>
													</div>
													<div className="row">
														<div className="title">Description:</div>
														<div>{sighting.sighting_description}</div>
													</div>
													<div className="row">
														<div className="title">Finder Name:</div>
														<div>{sighting.finder_name}</div>
													</div>
													<div className="row">
														<div className="title">Finder Email:</div>
														<div>{sighting.finder_email}</div>
													</div>
													<div className="row">
														<div className="title">Finder Phone:</div>
														<div>{sighting.finder_phone}</div>
													</div>
												</div>
											</div>
										)) :
											!addSighting &&
											<p>No sightings reported.</p>
									}
								</div>
							</div>
						)
				}

			</div>
		</div>
	);
};