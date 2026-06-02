import { useState } from "react";
import { Icon, List } from "@raycast/api";
import ClassListItem from "./ClassListItem";
import { ScheduledClass, Venue } from "../types";
import { dateLabel, dateOptions } from "../utils/dates";

interface ClassListProps {
  classes: ScheduledClass[];
  error: string | null;
  isLoading: boolean;
  selectedDate: string;
  venueName: string;
  onlyShowFull: boolean;
  hideSquash: boolean;
  listKey: number;
  onDateSelected: (date: string) => void;
  onRefresh: () => void;
  onVenueSelected: (venue: Venue) => void;
  onToggleOnlyShowFull: () => void;
  onToggleHideSquash: () => void;
}

function getVisibleClasses(classes: ScheduledClass[], onlyShowFull: boolean, hideSquash: boolean) {
  return classes
    .slice()
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .filter((cls) => {
      if (onlyShowFull && cls.spotsAvailable !== 0) return false;
      if (hideSquash && cls.activity.id === "squash") return false;
      return true;
    });
}

export default function ClassList({
  classes,
  error,
  isLoading,
  selectedDate,
  venueName,
  onlyShowFull,
  hideSquash,
  listKey,
  onDateSelected,
  onRefresh,
  onVenueSelected,
  onToggleOnlyShowFull,
  onToggleHideSquash,
}: ClassListProps) {
  const [searchText, setSearchText] = useState("");
  const visibleClasses = getVisibleClasses(classes, onlyShowFull, hideSquash);
  const parsedDate = new Date(`${selectedDate}T00:00:00`);

  return (
    <List
      isLoading={isLoading}
      key={listKey}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search classes..."
      searchBarAccessory={
        <List.Dropdown tooltip="Select date" defaultValue={selectedDate} onChange={onDateSelected}>
          {dateOptions().map((opt) => (
            <List.Dropdown.Item key={opt.value} value={opt.value} title={opt.title} />
          ))}
        </List.Dropdown>
      }
      navigationTitle={`${venueName} — ${dateLabel(parsedDate)}`}
    >
      {error ? (
        <List.EmptyView icon={Icon.Warning} title="Failed to load classes" description={error} />
      ) : visibleClasses.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Calendar}
          title="No classes"
          description="Try a different date, venue, or check your filters"
        />
      ) : (
        visibleClasses.map((cls) => (
          <ClassListItem
            key={cls.id}
            cls={cls}
            venueName={venueName}
            onlyShowFull={onlyShowFull}
            hideSquash={hideSquash}
            onRefresh={onRefresh}
            onVenueSelected={onVenueSelected}
            onToggleOnlyShowFull={onToggleOnlyShowFull}
            onToggleHideSquash={onToggleHideSquash}
          />
        ))
      )}
    </List>
  );
}
