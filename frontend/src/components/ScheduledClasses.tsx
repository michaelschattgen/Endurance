import { ScheduledClass } from "@/types/ScheduledClass";
import React from "react";

interface ScheduledClassesProps {
  classes: ScheduledClass[];
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({ classes }) => {
  return (
    <div className="space-y-4">
      {classes.map((cls, index) => (
        <div key={index} className="p-4 border rounded shadow-md">
          <h2 className="text-lg font-bold">{cls.name}</h2>
          <p>{cls.description}</p>
          <p className="text-sm text-gray-500">Starts on: {cls.startDate}</p>
        </div>
      ))}
    </div>
  );
};

export default ScheduledClasses;
