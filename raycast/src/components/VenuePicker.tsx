import { useState, useEffect } from "react";
import { List, ActionPanel, Action, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { getVenues } from "../api";
import { Venue } from "../types";
import { setDefaultVenue } from "../storage";
import { getErrorMessage } from "../utils/errors";

interface VenuePickerProps {
  onVenueSelected?: (venue: Venue) => void;
  shouldPop?: boolean;
}

export default function VenuePicker({ onVenueSelected, shouldPop = true }: VenuePickerProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pop } = useNavigation();

  useEffect(() => {
    getVenues()
      .then(setVenues)
      .catch((error: unknown) =>
        showToast({ style: Toast.Style.Failure, title: "Failed to load venues", message: getErrorMessage(error) })
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function selectVenue(venue: Venue) {
    await setDefaultVenue(venue);
    await showToast({ style: Toast.Style.Success, title: `Default venue: ${venue.name}` });
    onVenueSelected?.(venue);
    if (shouldPop) pop();
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search venues..." navigationTitle="Select Default Venue">
      {venues.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Warning}
          title="No venues found"
          description="Check your API base URL in preferences"
        />
      ) : (
        venues.map((venue) => (
          <List.Item
            key={venue.id}
            icon={Icon.Geopin}
            title={venue.name}
            actions={
              <ActionPanel>
                <Action title="Set as Default Venue" icon={Icon.Checkmark} onAction={() => selectVenue(venue)} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
