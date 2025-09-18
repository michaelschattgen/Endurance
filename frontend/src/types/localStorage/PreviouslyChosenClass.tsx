import { ScheduledClass } from "../ScheduledClass";

export type PreviouslyChosenClass = {
  name: string;
  startTime: string;
};

export type PinnedScheduledClass = ScheduledClass & { __pinned?: true };

export function toRef(cls: ScheduledClass) {
  return {
    name: cls.activity.name,
    startTime: new Date(cls.startTime).toISOString(),
  };
}
