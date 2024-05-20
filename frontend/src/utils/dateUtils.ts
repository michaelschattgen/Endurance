/**
 * Checks if two dates are on the same day.
 * @param date1 The first date to compare.
 * @param date2 The second date to compare.
 * @returns True if the dates are on the same day, false otherwise.
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const calculateEndTime = (startTime: string, durationSeconds: number) => {
  const startDate = new Date(startTime);
  startDate.setSeconds(startDate.getSeconds() + durationSeconds);
  return startDate.toLocaleTimeString([], { timeStyle: "short" });
};