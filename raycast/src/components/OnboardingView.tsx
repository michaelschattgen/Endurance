import { ActionPanel, Action, Icon, Detail } from "@raycast/api";
import { Venue } from "../types";
import VenuePicker from "./VenuePicker";

interface OnboardingViewProps {
  onVenueSelected: (venue: Venue) => void;
}

const markdown = `# Welcome to Endurance

No default venue set yet.

Press **Enter** to choose your venue and get started.`;

export default function OnboardingView({ onVenueSelected }: OnboardingViewProps) {
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.Push
            title="Choose Default Venue"
            icon={Icon.Geopin}
            target={<VenuePicker onVenueSelected={onVenueSelected} />}
          />
        </ActionPanel>
      }
    />
  );
}
