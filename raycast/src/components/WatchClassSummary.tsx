import { Form } from "@raycast/api";
import { ScheduledClass } from "../types";
import { formatDateLong, formatDuration, formatTime } from "../utils/dates";

interface WatchClassSummaryProps {
  cls: ScheduledClass;
  venueName: string;
}

export default function WatchClassSummary({ cls, venueName }: WatchClassSummaryProps) {
  const timeRange = `${formatTime(cls.startTime)} (${formatDuration(cls.durationSeconds)})`;

  return (
    <>
      <Form.Description title="Activity" text={cls.activity.name} />
      <Form.Description title="Date" text={formatDateLong(cls.startTime)} />
      <Form.Description title="Time" text={timeRange} />
      <Form.Description title="Venue" text={venueName} />
      <Form.Description title="Spots" text={`${cls.spotsAvailable} / ${cls.capacity} available`} />
      <Form.Separator />
    </>
  );
}
