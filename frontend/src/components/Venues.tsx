import { Venue } from "@/types/Venue";

interface VenuesProps {
  venues: Venue[];
  onSelect: (venue: Venue) => void;
}

const Venues: React.FC<VenuesProps> = ({ venues, onSelect }) => {
  return (
    <>
      <div className="space-y-2 pt-2 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
        {venues.map((venue, index) => (
          <div
            key={index}
            className="border rounded-lg grid grid-cols-[auto,1fr,auto] items-start cursor-pointer dark:border-zinc-700 dark:hover:bg-zinc-800 hover:bg-secondary/80"
            onClick={() => onSelect(venue)}
          >
            <div className="px-4 py-2">
              <div className="inline-flex items-center">
                <h2 className="text-md font-bold py-2">{venue.name}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Venues;
