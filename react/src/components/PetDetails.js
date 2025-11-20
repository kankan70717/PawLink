import { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";
import { FaRegEdit } from "react-icons/fa";
import ReportLostPets from "./ReportLostPets";

export const PetDetails = ({ id, setVisiblePetDetails }) => {
	const [petDetails, setPetDetails] = useState(null);
	const [edit, setEdit] = useState(false);
	console.log("Pet Details:", petDetails);

	useEffect(() => {
		try {
			const fetchPetDetails = async () => {
				const response = await fetch(`/api/pets/${id}`);
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
									{petDetails?.image &&
										<div className="pet-details-img">
											<img src={petDetails.image} alt={petDetails.pet_name} />
										</div>
									}
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
										<div>{petDetails?.owner_name}</div>
									</div>
									<div className="row">
										<div className="title">Owner Email:</div>
										<div>{petDetails?.owner_email}</div>
									</div>
									<div className="row">
										<div className="title">Owner Phone:</div>
										<div>{petDetails?.owner_phone}</div>
									</div>
								</div>
								<div>
									<h2>Sightings</h2>
									{petDetails?.sightings.length > 0 ? petDetails.sightings.map(sighting => (
										<div key={sighting.sighting_id} className="sighting-card">
											{sighting.sighting_image &&
												<div className="sighting-img">
													<img src={sighting.sighting_image} alt={`Sighting ${sighting.sighting_id}`} />
												</div>
											}
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
									)) : <p>No sightings reported.</p>}
								</div>
							</div>
						)
				}

			</div>
		</div>
	);
};