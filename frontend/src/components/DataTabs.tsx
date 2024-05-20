import React, { useState } from "react";
import { Button } from "./ui/button";

interface DateTabsProps {
  currentDate: Date;
  onSelect: (date: Date) => void;
}

const DateTabs: React.FC<DateTabsProps> = ({ currentDate, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate); // State to track the selected date
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week = [];

  for (let i = 0; i < 14; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    week.push(nextDate);
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date); // Update the selected date
    onSelect(date); // Propagate the selection
  };
  return (
    <div className="flex space-x-2 overflow-x-auto my-4 pb-4">
      {week.map((date, index) => {
        const isActive = date.toDateString() === selectedDate.toDateString(); // Check if the date is the selected date
        return (
          <Button
            key={index}
            className={`p-2 rounded-lg text-sm h-16 min-w-16 ${
              isActive ? "bg-black text-white" : "bg-gray-200"
            } hover:bg-gray-300`}
            onClick={() => handleSelectDate(date)}
          >
            <div className="flex flex-col items-center m-2">
              <div className={`font-bold ${isActive ? "text-white" : "text-gray-400"}`}>
                {daysOfWeek[date.getDay()]}
              </div>
              <div className={`${isActive ? "text-white" : "text-black"}`}>{date.getDate()}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default DateTabs;
