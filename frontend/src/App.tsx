import React, { useEffect, useState } from "react";
import { ScheduledClass } from "./types/ScheduledClass";
import ScheduledClasses from "./components/ScheduledClasses";
import DateTabs from "./components/DataTabs";
import { isSameDay } from "./utils/dateUtils";
import { Checkbox } from "./components/ui/checkbox";

function App() {
  const [onlyShowFull, setOnlyShowFull] = useState<boolean>(true);
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7289/get-classes");
        const data = await response.json();
        setClasses(data.scheduled_classes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCheckboxChange = () => {
    setOnlyShowFull(!onlyShowFull);
  };

  const filteredClasses = classes.filter((cls) => {
    const classDate = new Date(cls.startTime);
    return isSameDay(classDate, selectedDate) && (!onlyShowFull || cls.spotsAvailable == 0);
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded-lg">
        <DateTabs currentDate={new Date()} onSelect={handleDateSelect} />
        <div className="flex items-center space-x-2 my-4">
          <Checkbox
            checked={onlyShowFull}
            onCheckedChange={handleCheckboxChange}
            id="fullClasses"
          />
          <label
            htmlFor="fullClasses"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Only show full classes
          </label>
        </div>
        <ScheduledClasses classes={filteredClasses} />
      </div>
    </div>
  );
}

export default App;
