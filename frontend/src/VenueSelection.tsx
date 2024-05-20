import { useEffect, useState } from "react";
import { fetchVenues } from "./services/apiService";
import { Venue } from "./types/Venue";
import Venues from "./components/Venues";
import { useNavigate } from "react-router-dom";

const VenueSelectionComponent = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);

  const handleVenueSelect = (venue: Venue) => {
    localStorage.setItem("selectedVenue", JSON.stringify(venue));
    navigate("/");
  };

  useEffect(() => {
    fetchVenues()
      .then((data) => {
        setVenues(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      })
      .finally(() => {});
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="font-display text-xl font-extrabold text-gray-700">Select a venue</h2>
      </div>
      <Venues venues={venues} onSelect={handleVenueSelect} />
    </>
  );
};

export default VenueSelectionComponent;
