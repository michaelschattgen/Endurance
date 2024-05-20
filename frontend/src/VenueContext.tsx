import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Venue {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
}

interface VenueContextType {
  venue: Venue | null;
  setVenue: (venue: Venue | null) => void;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export const VenueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [venue, setVenue] = useState<Venue | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedVenueJson = localStorage.getItem("selectedVenue");
    if (storedVenueJson) {
      setVenue(JSON.parse(storedVenueJson));
    } else {
      navigate("/select-venue");
    }
  }, [navigate]);

  return <VenueContext.Provider value={{ venue, setVenue }}>{children}</VenueContext.Provider>;
};

export const useVenue = () => {
  const context = useContext(VenueContext);
  if (context === undefined) {
    throw new Error("useVenue must be used within a VenueProvider");
  }

  return context;
};
