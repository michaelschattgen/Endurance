import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { dateOptions, dateLabel, toDateString } from "../utils/dates";

interface DatePickerProps {
  onDateSelected: (date: string) => void;
}

const today = toDateString(new Date());

export default function DatePicker({ onDateSelected }: DatePickerProps) {
  const options = dateOptions();

  const todayIndex = options.findIndex((o) => o.value === today);
  const jumpTo = todayIndex >= 0 ? todayIndex * 50 : 0;

  return (
    <List navigationTitle="Select a date" searchBarPlaceholder="Search dates..." enableFiltering={false}>
      <List.EmptyView icon={Icon.Calendar} title="Pick a date above" />
      {options.map((opt, i) => (
        <List.Item
          key={opt.value}
          icon={i === todayIndex ? Icon.Clock : Icon.Calendar}
          title={opt.title}
          subtitle={i === 0 ? "─ today" : i === 1 ? "─ tomorrow" : undefined}
          actions={
            <ActionPanel>
              <Action title="Show Classes" icon={Icon.List} onAction={() => onDateSelected(opt.value)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
