import { Venue } from "@/types/Venue";

interface AddClassRequest {
  venueId: string;
  classId: string;
  emailAddress: string;
  startDateTime: string;
}

const baseURL = import.meta.env.VITE_API_BASEURL;

async function fetchVenues(): Promise<Venue[]> {
  const response = await fetch(`${baseURL}/get-venues`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: Venue[] = await response.json();
  return data;
}

async function fetchScheduledClasses(venueId: string, startDate: Date): Promise<any> {
  const response = await fetch(
    `${baseURL}/get-classes?venueId=${venueId}&startDate=${encodeURIComponent(
      startDate.toISOString().split("T")[0]
    )}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function addClass(requestData: AddClassRequest): Promise<any> {
  const response = await fetch(`${baseURL}/add-classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return;
}

export { fetchScheduledClasses, addClass, fetchVenues };
