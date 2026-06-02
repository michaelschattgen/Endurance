import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import VenuePicker from "./VenuePicker";
import WatchClassForm from "./WatchClassForm";
import { ScheduledClass, Venue } from "../types";
import { formatDuration, formatTime } from "../utils/dates";

interface ClassListItemProps {
  cls: ScheduledClass;
  venueName: string;
  onlyShowFull: boolean;
  hideSquash: boolean;
  onRefresh: () => void;
  onVenueSelected: (venue: Venue) => void;
  onToggleOnlyShowFull: () => void;
  onToggleHideSquash: () => void;
}

export default function ClassListItem({
  cls,
  venueName,
  onlyShowFull,
  hideSquash,
  onRefresh,
  onVenueSelected,
  onToggleOnlyShowFull,
  onToggleHideSquash,
}: ClassListItemProps) {
  const isFull = cls.spotsAvailable === 0;
  const timeStr = formatTime(cls.startTime);
  const durStr = formatDuration(cls.durationSeconds);

  return (
    <List.Item
      key={cls.id}
      icon={cls.classTypeIcon || (isFull ? Icon.CircleFilled : Icon.Circle)}
      title={cls.activity.name}
      subtitle={`${timeStr} · ${durStr}`}
      accessories={[
        {
          text: `${cls.spotsAvailable}/${cls.capacity}`,
          icon: {
            source: isFull ? Icon.CircleFilled : Icon.Circle,
            tintColor: isFull ? Color.Red : Color.Green,
          },
        },
      ]}
      actions={
        <ActionPanel>
          <Action.Push
            title="Watch Class"
            icon={Icon.Bell}
            shortcut={{ modifiers: ["cmd"], key: "return" }}
            target={<WatchClassForm cls={cls} venueName={venueName} />}
          />
          <Action
            title="Refresh"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={onRefresh}
          />
          <Action.Push
            title="Change Venue"
            icon={Icon.Geopin}
            shortcut={{ modifiers: ["cmd"], key: "v" }}
            target={<VenuePicker onVenueSelected={onVenueSelected} />}
          />
          <Action
            title={onlyShowFull ? "Show All Classes" : "Only Full Classes"}
            icon={onlyShowFull ? Icon.Eye : Icon.Filter}
            shortcut={{ modifiers: ["cmd", "shift"], key: "f" }}
            onAction={onToggleOnlyShowFull}
          />
          <Action
            title={hideSquash ? "Show Squash" : "Hide Squash"}
            icon={hideSquash ? Icon.Eye : Icon.Xmark}
            shortcut={{ modifiers: ["cmd", "shift"], key: "s" }}
            onAction={onToggleHideSquash}
          />
          <Action.CopyToClipboard
            title="Copy Class Name"
            content={cls.activity.name}
            shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
          />
        </ActionPanel>
      }
    />
  );
}
