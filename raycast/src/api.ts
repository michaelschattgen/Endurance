import { getPreferenceValues } from "@raycast/api";
import { Venue, ScheduledClass } from "./types";

interface AddClassRequest {
  venueId: string;
  classId: string;
  emailAddress: string;
  startDateTime: string;
}

function getBaseUrl(): string {
  const { apiBaseUrl } = getPreferenceValues<{ apiBaseUrl: string }>();
  return apiBaseUrl.replace(/\/+$/, "");
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error ${response.status}: ${text}`);
  }
  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function getVenues(): Promise<Venue[]> {
  return apiFetch("/get-venues");
}

export function getClasses(venueId: string, startDate: string): Promise<ScheduledClass[]> {
  return apiFetch(`/get-classes?venueId=${encodeURIComponent(venueId)}&startDate=${encodeURIComponent(startDate)}`);
}

export function addWatchedClass(request: AddClassRequest): Promise<void> {
  return apiFetch("/add-classes", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
