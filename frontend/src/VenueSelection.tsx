import { useEffect, useMemo, useState } from "react";
import { fetchVenues } from "./services/apiService";
import { Venue } from "./types/Venue";
import Venues from "./components/Venues";
import { useNavigate } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
import { Input } from "./components/ui/input";

const VenueSelectionComponent = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

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

  const filteredVenues = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return venues;

    console.log(q);

    return venues.filter((v) => {
      return v.name.toLowerCase().includes(q.trim());
    });
  }, [venues, searchFilter]);

  return (
    <>
      <div className="flex flex-col gap-3 ">
        <h2 className="font-display text-xl font-extrabold text-gray-700 dark:text-white whitespace-nowrap shrink-0 md:pr-4">
          Find your venue
        </h2>

        <div className="relative w-full md:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            id="venue-search"
            aria-label="Search venues"
            className="w-full pl-10 dark:bg-zinc-900 dark:border-zinc-800 dark:placeholder-zinc-400 dark:focus:ring-zinc-600"
            placeholder="Search venues…"
            type="text"
            value={searchFilter}
            disabled={loading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      <Venues venues={filteredVenues} onSelect={handleVenueSelect} />

      {loading && (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </>
  );
};

export default VenueSelectionComponent;
