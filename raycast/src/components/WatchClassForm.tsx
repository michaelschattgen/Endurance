import { useState, useEffect } from "react";
import { ActionPanel, Action, Form, Icon, showToast, Toast, LocalStorage, useNavigation } from "@raycast/api";
import { addWatchedClass } from "../api";
import { ScheduledClass } from "../types";
import { formatTime, formatDuration, formatDateLong } from "../utils/dates";
import { STORAGE_KEYS } from "../constants";

interface WatchClassFormProps {
  cls: ScheduledClass;
  venueName: string;
}

export default function WatchClassForm({ cls, venueName }: WatchClassFormProps) {
  const { pop } = useNavigation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    LocalStorage.getItem<string>(STORAGE_KEYS.EMAIL_ADDRESS).then((saved) => {
      if (saved) setEmail(saved);
    });
  }, []);

  async function handleSubmit() {
    if (!email.trim()) {
      await showToast({ style: Toast.Style.Failure, title: "Email is required" });
      return;
    }

    try {
      await addWatchedClass({
        venueId: cls.venueId,
        classId: cls.id,
        emailAddress: email.trim(),
        startDateTime: cls.startTime,
      });
      await LocalStorage.setItem(STORAGE_KEYS.EMAIL_ADDRESS, email.trim());
      await showToast({ style: Toast.Style.Success, title: "Now watching this class!" });
      pop();
    } catch (e) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to watch class",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  const timeRange = `${formatTime(cls.startTime)} (${formatDuration(cls.durationSeconds)})`;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Watch Class" icon={Icon.Bell} onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description title="Activity" text={cls.activity.name} />
      <Form.Description title="Date" text={formatDateLong(cls.startTime)} />
      <Form.Description title="Time" text={timeRange} />
      <Form.Description title="Venue" text={venueName} />
      <Form.Description title="Spots" text={`${cls.spotsAvailable} / ${cls.capacity} available`} />
      <Form.Separator />
      <Form.TextField
        id="email"
        title="Email"
        placeholder="your@email.com"
        value={email}
        onChange={setEmail}
        autoFocus
      />
    </Form>
  );
}
