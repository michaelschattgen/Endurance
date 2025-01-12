import { useEffect, useState } from "react";
import { fetchVenues } from "./services/apiService";
import { Venue } from "./types/Venue";
import Venues from "./components/Venues";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const VenueSelectionComponent = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const handleVenueSelect = (venue: Venue) => {
    localStorage.setItem("selectedVenue", JSON.stringify(venue));
    navigate("/");
  };

  useEffect(() => {
    setLoading(true);

    fetchVenues()
      .then((data) => {
        setVenues(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="font-display text-xl font-extrabold text-gray-700 dark:text-white">
          Select a venue
        </h2>
      </div>
      <Venues venues={venues} onSelect={handleVenueSelect} />

      {loading && (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </>
  );
};

export default VenueSelectionComponent;
