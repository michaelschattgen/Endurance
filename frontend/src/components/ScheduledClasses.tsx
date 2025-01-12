import { ScheduledClass } from "@/types/ScheduledClass";
import React, { useState } from "react";
import { ClassDetailsDialog } from "./ClassDetailsDialog";
import { formatClassDuration } from "@/utils/dateUtils";
import { Badge, badgeVariants } from "./ui/badge";

interface ScheduledClassesProps {
  classes: ScheduledClass[];
  showFullBadge: boolean;
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({
  classes,
  showFullBadge,
}) => {
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(
    null
  );
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
            className="p-4 border rounded-lg grid grid-cols-[auto,1fr,auto] dark:border-zinc-700 dark:hover:bg-zinc-800 hover:bg-secondary/80 items-start cursor-pointer"
            onClick={() => handleOpenDialog(cls)}
          >
            <div className="font-bold text-right pr-4 min-w-24">
              <div className="text-md font-bold">
                {new Date(cls.startTime).toLocaleTimeString([], {
                  timeStyle: "short",
                })}
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-400">
                {formatClassDuration(cls.durationSeconds)}
              </div>
            </div>
            <div className="px-4">
              <div className="inline-flex items-center">
                <h2 className="text-md font-bold">{cls.activity.name}</h2>
                {showFullBadge && cls.spotsAvailable == 0 && (
                  <Badge
                    className={`ml-2 font-thin ${badgeVariants({
                      variant: "destructive",
                    })} bg-red-400`}
                  >
                    Full
                  </Badge>
                )}
              </div>

              <p className="line-clamp-2 overflow-hidden text-xs text-gray-700 dark:text-gray-400">
                {cls.activity.description}
              </p>

              <div className={`flex items-center text-xs ${cls.spotsAvailable == 0 ? 'text-red-400' : 'text-gray-700'} dark:text-gray-400 mt-2 line-clamp-2 overflow-hidden`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>

                
                  {cls.spotsAvailable != 0 ? (
                    <span>{cls.spotsAvailable} / {cls.capacity} spots available</span>

                  ) : (
                    <span className="text-red-400">No spots available</span>
                  )}
              </div>
            </div>
            <div className="flex justify-center pl-4 align-middle grayscale">
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
