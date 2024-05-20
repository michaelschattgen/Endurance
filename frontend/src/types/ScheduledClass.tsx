import { Activity } from "./Activity";

export interface ScheduledClass {
  id: string;
  description: string;
  startTime: string;
  durationSeconds: number;
  classTypeIcon: string;
  spotsAvailable: number;
  venueId: string;
  activity: Activity;
}
