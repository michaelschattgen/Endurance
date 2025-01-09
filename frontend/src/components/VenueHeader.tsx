import React from "react";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useVenue } from "@/VenueContext";
import { useLocation } from "react-router-dom";


const VenueHeader: React.FC = () => {
  const { venue } = useVenue();
  const location = useLocation();

  return (
    <>
      {venue && location.pathname !== "/select-venue" && (
        <Button variant="ghost" className="mt-2 ml-0 pl-0 h-5 text-muted-foreground dark:hover:bg-zinc-900">
          <ChevronRight className="ml-1 h-4 w-4 opacity-50 mr-1" />
          {venue.name}
        </Button>
      )}
    </>
  );
};

export default VenueHeader;
