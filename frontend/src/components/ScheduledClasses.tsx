import { ScheduledClass } from "@/types/ScheduledClass";
import React, { useState } from "react";
import { ClassDetailsDialog } from "./ClassDetailsDialog";
import { calculateEndTime } from "@/utils/dateUtils";

interface ScheduledClassesProps {
  classes: ScheduledClass[];
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (cls: ScheduledClass) => {
    setSelectedClass(cls);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedClass(null);
  };

  return (
    <>
      <div className="space-y-4">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg grid grid-cols-[auto,1fr,auto] items-start cursor-pointer"
            onClick={() => handleOpenDialog(cls)}
          >
            <div className="font-bold text-right pr-4">
              <div className="text-md font-bold">
                {new Date(cls.startTime).toLocaleTimeString([], { timeStyle: "short" })}
              </div>
              <div className="text-md font-bold">
                {calculateEndTime(cls.startTime, cls.durationSeconds)}
              </div>
            </div>
            <div className="px-4">
              <h2 className="text-md font-bold">{cls.activity.name}</h2>
              <p className="line-clamp-2 overflow-hidden text-ellipsis">
                {cls.activity.description}
              </p>
            </div>
            <div className="flex justify-center pl-4 align-middle">
              <img width="35" src={cls.classTypeIcon} />
            </div>
          </div>
        ))}
      </div>
      <ClassDetailsDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        classDetails={selectedClass}
      />
    </>
  );
};

export default ScheduledClasses;
