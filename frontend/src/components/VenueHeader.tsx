import React from "react";
import { Button } from "./ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useVenue } from "@/VenueContext";

interface VenuesProps {
  onClick: () => void;
}

const VenueHeader: React.FC<VenuesProps> = ({ onClick }) => {
  const { venue } = useVenue();

  return (
    <>
      {venue && (
        <Button variant="outline" onClick={onClick}>
          {venue.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      )}
    </>
  );
};

export default VenueHeader;
