import { ScheduledClass } from "@/types/ScheduledClass";
import React from "react";

interface ScheduledClassesProps {
  classes: ScheduledClass[];
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({ classes }) => {
  const calculateEndTime = (startTime: string, durationSeconds: number) => {
    const startDate = new Date(startTime);
    startDate.setSeconds(startDate.getSeconds() + durationSeconds);
    return startDate.toLocaleTimeString([], { timeStyle: "short" });
  };

  return (
    <div className="space-y-4">
      {classes.map((cls, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg grid grid-cols-[auto,1fr,auto] items-start"
        >
          <div className="font-bold text-right pr-4">
            <div className="align-top">
              {new Date(cls.startTime).toLocaleTimeString([], { timeStyle: "short" })}
            </div>
            <div className="align-top">{calculateEndTime(cls.startTime, cls.durationSeconds)}</div>
          </div>
          <div className="px-4">
            <h2 className="text-lg font-bold">{cls.activity.name}</h2>
            <p className="line-clamp-2 overflow-hidden text-ellipsis">{cls.activity.description}</p>
          </div>
          <div className="flex justify-center pl-4 align-middle">
            <img width="35" src={cls.classTypeIcon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledClasses;
