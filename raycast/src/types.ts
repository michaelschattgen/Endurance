export interface Venue {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  subcatagory: string;
  description: string;
  imageUrl: string;
}

export interface ScheduledClass {
  id: string;
  description: string;
  startTime: string;
  durationSeconds: number;
  classTypeIcon: string;
  spotsAvailable: number;
  venueId: string;
  activity: Activity;
  capacity: number;
}
