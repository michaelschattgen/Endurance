import { useState, useEffect } from "react";
import { ActionPanel, Action, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { addWatchedClass } from "../api";
import { ScheduledClass } from "../types";
import { getSavedEmailAddress, setSavedEmailAddress } from "../storage";
import { getErrorMessage } from "../utils/errors";
import WatchClassSummary from "./WatchClassSummary";

interface WatchClassFormProps {
  cls: ScheduledClass;
  venueName: string;
}

export default function WatchClassForm({ cls, venueName }: WatchClassFormProps) {
  const { pop } = useNavigation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    getSavedEmailAddress().then((saved) => {
      if (saved) setEmail(saved);
    });
  }, []);

  async function handleSubmit() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      await showToast({ style: Toast.Style.Failure, title: "Email is required" });
      return;
    }

    try {
      await addWatchedClass({
        venueId: cls.venueId,
        classId: cls.id,
        emailAddress: normalizedEmail,
        startDateTime: cls.startTime,
      });
      await setSavedEmailAddress(normalizedEmail);
      await showToast({ style: Toast.Style.Success, title: "Now watching this class!" });
      pop();
    } catch (error: unknown) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to watch class",
        message: getErrorMessage(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Watch Class"
            icon={Icon.Bell}
            shortcut={{ modifiers: [], key: "return" }}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <WatchClassSummary cls={cls} venueName={venueName} />
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
