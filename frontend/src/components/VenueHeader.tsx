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
        <Button
          variant="ghost"
          className="h-auto min-w-0 flex-1 justify-start whitespace-normal py-2 pl-0 text-left text-muted-foreground dark:hover:bg-zinc-900"
        >
          <ChevronRight className="ml-1 mr-1 h-4 w-4 shrink-0 opacity-50" />
          <span className="min-w-0 break-words">{venue.name}</span>
        </Button>
      )}
    </>
  );
};

export default VenueHeader;
