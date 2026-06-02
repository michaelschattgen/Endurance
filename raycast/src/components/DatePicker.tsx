import { useState } from "react";
import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { dateOptions, toDateString } from "../utils/dates";

interface DatePickerProps {
  onDateSelected: (date: string) => void;
}

const today = toDateString(new Date());

export default function DatePicker({ onDateSelected }: DatePickerProps) {
  const [searchText, setSearchText] = useState("");
  const options = dateOptions();

  const todayIndex = options.findIndex((o) => o.value === today);

  return (
    <List
      navigationTitle="Select a date"
      searchBarPlaceholder="Search dates..."
      searchText={searchText}
      onSearchTextChange={setSearchText}
    >
      {options.length === 0 ? (
        <List.EmptyView icon={Icon.Calendar} title="Pick a date above" />
      ) : (
        options.map((opt, i) => (
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
        ))
      )}
    </List>
  );
}
