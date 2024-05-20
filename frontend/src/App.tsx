import { useEffect, useState } from "react";
import { ScheduledClass } from "./types/ScheduledClass";
import ScheduledClasses from "./components/ScheduledClasses";
import DateTabs from "./components/DataTabs";
import { isSameDay } from "./utils/dateUtils";
import { Checkbox } from "./components/ui/checkbox";
import { Toaster } from "sonner";
import { fetchScheduledClasses } from "./services/apiService";

function App() {
  const [onlyShowFull, setOnlyShowFull] = useState<boolean>(true);
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshNeeded, setRefreshNeeded] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchScheduledClasses(selectedDate)
      .then((data) => {
        setClasses(data.scheduled_classes);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    setRefreshNeeded(false);
  }, [refreshNeeded]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setRefreshNeeded(true);
  };

  const handleCheckboxChange = () => {
    setOnlyShowFull(!onlyShowFull);
  };

  const filteredClasses = classes.filter((cls) => {
    const classDate = new Date(cls.startTime);
    return isSameDay(classDate, selectedDate) && (!onlyShowFull || cls.spotsAvailable == 0);
  });

  return (
    <div className={`flex justify-center min-h-screen bg-gray-100 font-geist py-0 md:py-2`}>
      <div className="w-full max-w-4xl">
        <div className="p-2 pl-4">
          <h1 className="font-display text-3xl font-extrabold text-gray-700 sm:text-4xl">
            Endurance
          </h1>
        </div>

        <div className="p-5 sm:min-h-2/4 min-h-3/4 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col md:flex-row justify-between">
            <h2 className="font-display text-xl font-extrabold text-gray-700">Pick a day</h2>
            <div className="flex items-center mt-4 md:mt-0">
              <Checkbox
                checked={onlyShowFull}
                onCheckedChange={handleCheckboxChange}
                id="fullClasses"
              />
              <label
                htmlFor="fullClasses"
                className="text-sm font-medium leading-none ml-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Only show full classes
              </label>
            </div>
          </div>

          <DateTabs currentDate={new Date()} onSelect={handleDateSelect} />
          <ScheduledClasses classes={filteredClasses} showFullBadge={!onlyShowFull} />
          {!loading && filteredClasses.length == 0 && (
            <div className="pt-12">
              <div>
                <h2 className="text-center text-black text-md font-semibold leading-7">
                  No classes found
                </h2>
                <p className="text-center text-black text-base font-normal leading-relaxed pb-4">
                  Try changing the filters <br />
                  to see classes
                </p>
              </div>
            </div>
          )}
        </div>

        <Toaster />
      </div>
    </div>
  );
}

export default App;
