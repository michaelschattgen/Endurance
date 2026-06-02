import { getPreferenceValues } from "@raycast/api";
import { Venue, ScheduledClass } from "./types";

export interface AddWatchedClassRequest {
  venueId: string;
  classId: string;
  emailAddress: string;
  startDateTime: string;
}

function getBaseUrl(): string {
  const { apiBaseUrl } = getPreferenceValues<{ apiBaseUrl: string }>();
  return apiBaseUrl.replace(/\/+$/, "");
}

function createHeaders(headers?: RequestInit["headers"]): NonNullable<RequestInit["headers"]> {
  return {
    "Content-Type": "application/json",
    Accept: "*/*",
    ...headers,
  };
}

async function parseResponse<T>(response: Response, parseBody: boolean): Promise<T> {
  if (!parseBody) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

async function apiFetch<T>(path: string, init?: RequestInit, parseBody = true): Promise<T> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: createHeaders(init?.headers),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error ${response.status}: ${text}`);
  }

  return parseResponse<T>(response, parseBody);
}

export function getVenues(): Promise<Venue[]> {
  return apiFetch("/get-venues");
}

export function getClasses(venueId: string, startDate: string): Promise<ScheduledClass[]> {
  return apiFetch(`/get-classes?venueId=${encodeURIComponent(venueId)}&startDate=${encodeURIComponent(startDate)}`);
}

export function addWatchedClass(request: AddWatchedClassRequest): Promise<void> {
  return apiFetch("/add-classes", {
    method: "POST",
    body: JSON.stringify(request),
  }, false);
}
