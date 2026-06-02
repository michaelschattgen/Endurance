import { useState, useEffect } from "react";
import { List, ActionPanel, Action, Icon, Color, LocalStorage, useNavigation } from "@raycast/api";
import { getClasses } from "../api";
import { ScheduledClass } from "../types";
import { formatTime, formatDuration, dateLabel, toDateString, dateOptions } from "../utils/dates";
import { STORAGE_KEYS } from "../constants";
import WatchClassForm from "../components/WatchClassForm";
import VenuePicker from "../components/VenuePicker";
import OnboardingView from "../components/OnboardingView";

export default function BrowseClassesView() {
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [venueId, setVenueId] = useState<string | null>(null);
  const [venueName, setVenueName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { push } = useNavigation();

  useEffect(() => {
    LocalStorage.getItem<string>(STORAGE_KEYS.DEFAULT_VENUE_ID).then((id) => {
      if (id) {
        setVenueId(id);
        LocalStorage.getItem<string>(STORAGE_KEYS.DEFAULT_VENUE_NAME).then((name) => {
          setVenueName(name ?? "");
        });
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (venueId) {
      setIsLoading(true);
      setError(null);
      getClasses(venueId, selectedDate)
        .then(setClasses)
        .catch((e: Error) => setError(e.message))
        .finally(() => setIsLoading(false));
    }
  }, [venueId, selectedDate]);

  if (!venueId) {
    return (
      <OnboardingView
        onVenueSelected={(v) => {
          setVenueId(v.id);
          setVenueName(v.name);
        }}
      />
    );
  }

  const parsedDate = new Date(selectedDate + "T00:00:00");

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search classes..."
      searchBarAccessory={
        <List.Dropdown tooltip="Select date" value={selectedDate} onChange={setSelectedDate}>
          {dateOptions().map((opt) => (
            <List.Dropdown.Item key={opt.value} value={opt.value} title={opt.title} />
          ))}
        </List.Dropdown>
      }
      navigationTitle={`${venueName} — ${dateLabel(parsedDate)}`}
    >
      {error ? (
        <List.EmptyView icon={Icon.Warning} title="Failed to load classes" description={error} />
      ) : classes.length === 0 && !isLoading ? (
        <List.EmptyView icon={Icon.Calendar} title="No classes" description="Try a different date or venue" />
      ) : (
        classes
          .slice()
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .map((cls) => {
            const isFull = cls.spotsAvailable === 0;
            const timeStr = formatTime(cls.startTime);
            const durStr = formatDuration(cls.durationSeconds);
            return (
              <List.Item
                key={cls.id}
                icon={cls.classTypeIcon || (isFull ? Icon.CircleFilled : Icon.Circle)}
                title={cls.activity.name}
                subtitle={`${timeStr} · ${durStr}`}
                accessories={[
                  {
                    text: `${cls.spotsAvailable}/${cls.capacity}`,
                    icon: {
                      source: isFull ? Icon.CircleFilled : Icon.Circle,
                      tintColor: isFull ? Color.Red : Color.Green,
                    },
                  },
                ]}
                actions={
                  <ActionPanel>
                    <Action.Push
                      title="Watch Class"
                      icon={Icon.Bell}
                      shortcut={{ modifiers: ["cmd"], key: "w" }}
                      target={<WatchClassForm cls={cls} venueName={venueName} />}
                    />
                    <Action.Push
                      title="Change Venue"
                      icon={Icon.Geopin}
                      shortcut={{ modifiers: ["cmd"], key: "v" }}
                      target={
                        <VenuePicker
                          onVenueSelected={(v) => {
                            setVenueId(v.id);
                            setVenueName(v.name);
                          }}
                        />
                      }
                    />
                    <Action.CopyToClipboard
                      title="Copy Class Name"
                      content={cls.activity.name}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                  </ActionPanel>
                }
              />
            );
          })
      )}
    </List>
  );
}
