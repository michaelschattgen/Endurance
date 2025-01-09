import React, { useState } from "react";
import { Button } from "./ui/button";

interface DateTabsProps {
  currentDate: Date;
  onSelect: (date: Date) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({ currentDate, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week = [];

  for (let i = 0; i < 14; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    week.push(nextDate);
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    onSelect(date);
  };
  return (
    <div className="flex space-x-2 overflow-x-auto my-4 pb-4 p-2">
      {week.map((date, index) => {
        const isActive = date.toDateString() === selectedDate.toDateString();
        return (
          <Button
            key={index}
            className={`p-2 rounded-lg text-sm h-16 min-w-16 dark:hover:bg-zinc-800 ${
              isActive ? "bg-black text-white hover:bg-gray-800 dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800 dark:text-zinc-300" : "bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700"
            } `}
            onClick={() => handleSelectDate(date)}
          >
            <div className="flex flex-col items-center m-2">
              <div className={`font-bold ${isActive ? "text-white" : "text-gray-400 dark:text-zinc-50 "}`}>
                {daysOfWeek[date.getDay()]}
              </div>
              <div className={`${isActive ? "text-white" : "text-black dark:text-white"}`}>{date.getDate()}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default DateTabs;
