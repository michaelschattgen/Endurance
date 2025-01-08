import { intervalToDuration, formatDuration } from 'date-fns';

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

export const formatClassDuration = (seconds: number): string => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  let formatted = formatDuration(duration, { format: ['days', 'hours', 'minutes'] });
  formatted = formatted.replace(/minutes/g, 'mins');

  return formatted || 'less than a minute';
}