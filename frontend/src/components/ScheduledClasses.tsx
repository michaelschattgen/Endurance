import { ScheduledClass } from "@/types/ScheduledClass";
import React, { useEffect, useMemo, useState } from "react";
import { ClassDetailsDialog } from "./ClassDetailsDialog";
import { formatClassDuration } from "@/utils/dateUtils";
import { loadPreviousClasses, sameByNameDayAndTime } from "@/utils/storage";
import { History } from "lucide-react";
import {
  PinnedScheduledClass,
  PreviouslyChosenClass,
  toRef,
} from "@/types/localStorage/PreviouslyChosenClass";

interface ScheduledClassesProps {
  classes: ScheduledClass[];
}

const ScheduledClasses: React.FC<ScheduledClassesProps> = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [previousRefs, setPreviousRefs] = useState<PreviouslyChosenClass[]>([]);

  useEffect(() => {
    setPreviousRefs(loadPreviousClasses());
  }, []);

  useEffect(() => {
    const onUpdate = () => setPreviousRefs(loadPreviousClasses());
    window.addEventListener("previous-classes:updated", onUpdate);
    return () => window.removeEventListener("previous-classes:updated", onUpdate);
  }, []);

  const handleOpenDialog = (cls: ScheduledClass) => {
    setSelectedClass(cls);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedClass(null);
  };

  const displayClasses = useMemo<PinnedScheduledClass[]>(() => {
    if (!classes?.length || !previousRefs.length) {
      return classes as PinnedScheduledClass[];
    }

    const pinnedIdxs: number[] = classes.reduce((acc, cls, idx) => {
      if (previousRefs.some((p) => sameByNameDayAndTime(toRef(cls), p))) acc.push(idx);
      return acc;
    }, [] as number[]);

    if (pinnedIdxs.length === 0) {
      return classes as PinnedScheduledClass[];
    }

    // Duplicate matched items that are not at the top
    const duplicates: PinnedScheduledClass[] = pinnedIdxs
      .filter((i) => i !== 0)
      .map((i) => ({ ...classes[i], __pinned: true }));

    if (duplicates.length === 0) {
      // Nothing to duplicate; just annotate the top item if it's pinned
      const annotated: PinnedScheduledClass[] = classes.map((c, idx) =>
        idx === 0 && pinnedIdxs.includes(0) ? { ...c, __pinned: true } : { ...c }
      );
      return annotated;
    }

    // Don't add __pinned to items that will be duplicated
    const annotated: PinnedScheduledClass[] = classes.map((c, idx) => {
      if (idx === 0 && pinnedIdxs.includes(0)) {
        return { ...c, __pinned: true };
      }
      return { ...c };
    });

    if (pinnedIdxs.includes(0)) {
      return [annotated[0], ...duplicates, ...annotated.slice(1)];
    } else {
      return [...duplicates, ...annotated];
    }
  }, [classes, previousRefs]);

  return (
    <>
      <div className="space-y-4">
        {displayClasses.map((cls, index) => {
          const pinned = cls.__pinned === true;

          return (
            <div className="relative group" key={index}>
              <div
                className={`${
                  pinned
                    ? "absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-75"
                    : ""
                }`}
              ></div>
              <div
                key={`${index}-${pinned ? "p" : "n"}`}
                onClick={() => handleOpenDialog(cls)}
                className={[
                  "relative p-4 bg-white border rounded-lg grid grid-cols-[auto,1fr,auto] items-start cursor-pointer",
                  "dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 hover:bg-gray-100",
                  pinned ? "relative shadow-[0_0_0_3px_rgba(251,191,36,0.15)] mb-8" : "",
                ].join(" ")}
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
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <h2 className="text-md font-bold">{cls.activity.name}</h2>

                    {pinned && (
                      <span
                        className="
                          inline-flex items-center gap-1 rounded-md mb-3 sm:mb-0
                          border border-zinc-300/70 bg-zinc-100 text-zinc-600
                          dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300
                          px-1.5 py-0.5 text-[10px] leading-none align-middle"
                      >
                        <History className="h-3 w-3 opacity-70" aria-hidden />
                        <span>Previously chosen</span>
                      </span>
                    )}
                  </div>

                  {cls.activity.description && (
                    <p className="line-clamp-2 overflow-hidden text-xs text-gray-700 dark:text-gray-400">
                      {cls.activity.description}
                    </p>
                  )}

                  <div
                    className={`flex items-center text-xs ${
                      cls.spotsAvailable == 0 ? "text-red-400" : "text-gray-700"
                    } dark:text-gray-400 mt-2 line-clamp-2 overflow-hidden`}
                  >
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
                      <span>
                        {cls.spotsAvailable} / {cls.capacity} spots available
                      </span>
                    ) : (
                      <span className="text-red-400">No spots available</span>
                    )}
                  </div>
                </div>

                <div className="md:flex justify-center pl-4 align-middle hidden grayscale">
                  <img width="35" src={cls.classTypeIcon} />
                </div>
              </div>
            </div>
          );
        })}
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
