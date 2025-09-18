import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { calculateEndTime } from "@/utils/dateUtils";
import { Label } from "./ui/label";
import { ScheduledClass } from "@/types/ScheduledClass";
import { toast } from "sonner";
import { addClass } from "@/services/apiService";
import { addPreviousClass, isClassInHistoryByRef, removePreviousClass } from "@/utils/storage";
import { toRef } from "@/types/localStorage/PreviouslyChosenClass";

interface ClassDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  classDetails: ScheduledClass | null;
}

export const ClassDetailsDialog: React.FC<ClassDetailsDialogProps> = ({
  open,
  onClose,
  classDetails,
}) => {
  const [email, setEmail] = useState(() => {
    const defaultEmail = localStorage.getItem("emailAddress");
    return defaultEmail ?? "";
  });

  const [loading, setLoading] = useState(false);

  if (!classDetails) return null;

  const isInHistory = isClassInHistoryByRef(toRef(classDetails));

  const handleRemoveFromHistory = () => {
    removePreviousClass(toRef(classDetails));
    toast("Removed from history", {
      description: classDetails.activity.name,
    });

    window.dispatchEvent(new CustomEvent("previous-classes:updated"));

    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      venueId: classDetails.venueId,
      classId: classDetails.id,
      emailAddress: email,
      startDateTime: classDetails.startTime,
    };

    if (email == null || email == "") {
      toast.error("Failed to add watcher", {
        description: "Please provide an email address.",
      });

      setLoading(false);
      return;
    }

    addClass(payload)
      .then(() => {
        setLoading(false);

        onClose();

        localStorage.setItem("emailAddress", email);

        const startISO = new Date(classDetails.startTime).toISOString();

        addPreviousClass({
          name: classDetails.activity.name,
          startTime: startISO,
        });

        toast("Added notification for class", {
          description: `${classDetails.activity.name} on ${new Date(
            classDetails.startTime
          ).toDateString()} at ${new Date(classDetails.startTime).toLocaleTimeString([], {
            timeStyle: "short",
          })}`,
        });
      })
      .catch((error) => {
        console.error("Failed to add class:", error);
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="mt-4 font-geist dark:bg-zinc-900 dark:text-white dark:border-zinc-800">
        <DialogHeader className="flex justify-between space-x-4 text-center sm:text-left">
          <div className="text-left flex-1">
            <h2 className="text-lg font-bold">Get notified for this class</h2>
            <p className="text-sm text-muted-foreground dark:text-zinc-400 ">
              Enter your email address below to get notified whenever there's a spot available in
              this class.
            </p>
          </div>
        </DialogHeader>
        <div className="grid gap-3 text-sm ">
          <div className="font-semibold ">Class information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground dark:text-zinc-400">Activity</dt>
              <dd>{classDetails.activity.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground dark:text-zinc-400">Day</dt>
              <dd>{new Date(classDetails.startTime).toDateString()}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground dark:text-zinc-400">Time</dt>
              <dd>
                {new Date(classDetails.startTime).toLocaleTimeString([], {
                  timeStyle: "short",
                })}{" "}
                - {calculateEndTime(classDetails.startTime, classDetails.durationSeconds)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground dark:text-zinc-400">Capacity</dt>
              <dd>{classDetails.capacity}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-semibold" htmlFor="name">
            Email
          </Label>
          <Input
            id="name"
            className="col-span-3 dark:bg-zinc-900 dark:border-zinc-800 dark:placeholder-zinc-400 dark:focus:ring-zinc-600"
            placeholder="Email address"
            type="email"
            value={email}
            tabIndex={-1}
            autoComplete="email"
            disabled={loading}
            required
            onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <DialogFooter className="mt-4">
          <div className="flex w-full flex-col md:flex-row gap-2 items-stretch md:items-center">
            {isInHistory && (
              <Button onClick={handleRemoveFromHistory} className="text-red-500" variant={"ghost"}>
                Remove from history
              </Button>
            )}

            <Button
              onClick={onClose}
              className={`order-2 md:order-1 md:ml-auto ${buttonVariants({
                variant: "ghost",
              })} dark:bg-transparent dark:text-white`}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={loading}
              className={`order-1 md:order-1  ${buttonVariants({
                variant: "default",
              })} dark:bg-zinc-800 dark:text-zinc-50`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Save
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
