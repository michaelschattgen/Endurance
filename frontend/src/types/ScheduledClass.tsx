import { Activity } from "./Activity";

export interface ScheduledClass {
  id: string;
  name: string;
  description: string;
  startTime: string;
  durationSeconds: number;
  classTypeIcon: string;
  spotsAvailable: number;

  activity: Activity;
}
