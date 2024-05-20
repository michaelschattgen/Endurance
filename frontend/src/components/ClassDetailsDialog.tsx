import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { calculateEndTime } from "@/utils/dateUtils";
import { Label } from "./ui/label";
import { ScheduledClass } from "@/types/ScheduledClass";

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
  const [email, setEmail] = useState("");

  if (!classDetails) return null;

  console.log(classDetails);

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent className="mt-4 font-geist">
        <DialogHeader className="flex justify-between space-x-4 text-center sm:text-left">
          <div className="text-left flex-1">
            <h2 className="text-lg font-bold">Get notified for this class</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email address below to get notified whenever there's a spot available in
              this class.
            </p>
          </div>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="font-semibold">Class information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Activity</dt>
              <dd>{classDetails.activity.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Day</dt>
              <dd>{new Date(classDetails.startTime).toDateString()}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Time</dt>
              <dd>
                {new Date(classDetails.startTime).toLocaleTimeString([], { timeStyle: "short" })} -{" "}
                {calculateEndTime(classDetails.startTime, classDetails.durationSeconds)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-3">
          <Label className="text-sm font-semibold" htmlFor="name">
            Email
          </Label>
          <Input
            id="name"
            className="col-span-3"
            placeholder="Email"
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button onClick={onClose} className={buttonVariants({ variant: "secondary" })}>
            Cancel
          </Button>
          <Button
            onClick={() => alert("Save functionality not implemented")}
            className={buttonVariants({ variant: "default" })}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
