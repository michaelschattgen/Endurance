interface AddClassRequest {
  venueId: string;
  classId: string;
  emailAddress: string;
  startDateTime: string;
}

const baseURL = import.meta.env.VITE_API_BASEURL;

async function fetchScheduledClasses(startDate: Date): Promise<any> {
  const response = await fetch(
    `${baseURL}/get-classes?startDate=${encodeURIComponent(startDate.toDateString())}`
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
  return response.json();
}

export { fetchScheduledClasses, addClass };
