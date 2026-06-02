import { LocalStorage } from "@raycast/api";
import { STORAGE_KEYS } from "./constants";
import { Venue } from "./types";

export async function getDefaultVenue(): Promise<Venue | null> {
  const [id, name] = await Promise.all([
    LocalStorage.getItem<string>(STORAGE_KEYS.DEFAULT_VENUE_ID),
    LocalStorage.getItem<string>(STORAGE_KEYS.DEFAULT_VENUE_NAME),
  ]);

  if (!id) return null;

  return {
    id,
    name: name ?? "",
  };
}

export async function setDefaultVenue(venue: Venue): Promise<void> {
  await Promise.all([
    LocalStorage.setItem(STORAGE_KEYS.DEFAULT_VENUE_ID, venue.id),
    LocalStorage.setItem(STORAGE_KEYS.DEFAULT_VENUE_NAME, venue.name),
  ]);
}

export function setLastSelectedDate(date: string): Promise<void> {
  return LocalStorage.setItem(STORAGE_KEYS.LAST_SELECTED_DATE, date);
}

export function getSavedEmailAddress(): Promise<string | undefined> {
  return LocalStorage.getItem<string>(STORAGE_KEYS.EMAIL_ADDRESS);
}

export function setSavedEmailAddress(email: string): Promise<void> {
  return LocalStorage.setItem(STORAGE_KEYS.EMAIL_ADDRESS, email);
}
