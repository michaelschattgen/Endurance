import { useState, useEffect } from "react";
import DateTabs from "./components/DataTabs";
import ScheduledClasses from "./components/ScheduledClasses";
import { fetchScheduledClasses } from "./services/apiService";
import { ScheduledClass } from "./types/ScheduledClass";
import { isSameDay } from "./utils/dateUtils";
import { Checkbox } from "./components/ui/checkbox";
import { useVenue } from "./VenueContext";
import moment from "moment";
import { Loader2 } from "lucide-react";

function ClassSelector() {
  const { venue } = useVenue();
  const [onlyShowFull, setOnlyShowFull] = useState<boolean>(true);
  const [hideSquash, setHideSquash] = useState<boolean>(true);
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshNeeded, setRefreshNeeded] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!venue) return;
    const localDate = moment(selectedDate).format("YYYY-MM-DD");
    fetchScheduledClasses(venue?.id, localDate)
      .then((data) => {
        setClasses(data);
      })
      .catch((error) => {
        console.error("Failed to fetch classes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    setRefreshNeeded(false);
  }, [venue, refreshNeeded]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setRefreshNeeded(true);
  };

  const handleCheckboxChange = () => {
    setOnlyShowFull(!onlyShowFull);
  };

  const handleSquashCheckboxChange = () => {
    setHideSquash(!hideSquash);
  };

  const filteredClasses = classes.filter((cls) => {
    const classDate = new Date(cls.startTime);
    const shouldHideSquash = cls.activity.id == "squash" && hideSquash;
    return (
      isSameDay(classDate, selectedDate) &&
      (!onlyShowFull || cls.spotsAvailable == 0) &&
      !shouldHideSquash
    );
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="font-display text-xl font-extrabold text-gray-700 dark:text-white">Pick a day</h2>
        <div className="flex items-center mt-4 md:mt-0">
          <Checkbox
            checked={hideSquash}
            onCheckedChange={handleSquashCheckboxChange}
            id="hideSquash"
          />
          <label
            htmlFor="hideSquash"
            className="text-sm font-medium leading-none ml-2 pr-3 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
          >
            Hide squash
          </label>
          <Checkbox
            checked={onlyShowFull}
            onCheckedChange={handleCheckboxChange}
            id="fullClasses"
          />
          <label
            htmlFor="fullClasses"
            className="text-sm font-medium leading-none ml-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
          >
            Only show full classes
          </label>
        </div>
      </div>

      <DateTabs currentDate={new Date()} onSelect={handleDateSelect} />
      <ScheduledClasses classes={filteredClasses} showFullBadge={!onlyShowFull} />
      {loading && (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {!loading && filteredClasses.length == 0 && (
        <div className="h-60 flex items-center justify-center">
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
    </>
  );
}

export default ClassSelector;
