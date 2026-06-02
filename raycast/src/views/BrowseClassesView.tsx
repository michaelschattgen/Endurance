import { useState, useEffect, useCallback } from "react";
import { List } from "@raycast/api";
import { getClasses } from "../api";
import { ScheduledClass, Venue } from "../types";
import { STORAGE_KEYS } from "../constants";
import VenuePicker from "../components/VenuePicker";
import DatePicker from "../components/DatePicker";
import ClassList from "../components/ClassList";
import { getDefaultVenue, setLastSelectedDate } from "../storage";

type ViewState = "loading" | "pick-venue" | "pick-date" | "show-classes";

export default function BrowseClassesView() {
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [venueId, setVenueId] = useState<string | null>(null);
  const [venueName, setVenueName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [onlyShowFull, setOnlyShowFull] = useState(true);
  const [hideSquash, setHideSquash] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [classesListKey, setClassesListKey] = useState(0);

  const [viewState, setViewState] = useState<ViewState>("loading");

  const venueAndDate = `${venueId}::${selectedDate}`;

  const loadClasses = useCallback(async () => {
    if (!venueId || !selectedDate) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getClasses(venueId, selectedDate);
      setClasses(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueAndDate, refreshKey]);

  useEffect(() => {
    getDefaultVenue().then((venue) => {
      if (venue) {
        setVenueId(venue.id);
        setVenueName(venue.name);
        setViewState("pick-date");
      } else {
        setViewState("pick-venue");
      }
    });
  }, []);

  useEffect(() => {
    if (viewState === "show-classes" && venueId && selectedDate) {
      loadClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewState, venueAndDate, refreshKey]);

  function handleVenueSelected(venue: Venue) {
    setVenueId(venue.id);
    setVenueName(venue.name);
    setViewState("pick-date");
  }

  function handleDateSelected(date: string) {
    const wasPickingDate = viewState === "pick-date";
    setSelectedDate(date);
    setLastSelectedDate(date);
    setViewState("show-classes");
    if (wasPickingDate) {
      setClassesListKey((k) => k + 1);
    }
  }

  if (viewState === "loading") {
    return <List isLoading={true} />;
  }

  if (viewState === "pick-venue") {
    return <VenuePicker shouldPop={false} onVenueSelected={handleVenueSelected} />;
  }

  if (viewState === "pick-date") {
    return <DatePicker onDateSelected={handleDateSelected} />;
  }

  return (
    <ClassList
      classes={classes}
      error={error}
      isLoading={isLoading}
      selectedDate={selectedDate}
      venueName={venueName}
      onlyShowFull={onlyShowFull}
      hideSquash={hideSquash}
      listKey={classesListKey}
      onDateSelected={handleDateSelected}
      onRefresh={() => setRefreshKey((key) => key + 1)}
      onVenueSelected={handleVenueSelected}
      onToggleOnlyShowFull={() => setOnlyShowFull((value) => !value)}
      onToggleHideSquash={() => setHideSquash((value) => !value)}
    />
  );
}
