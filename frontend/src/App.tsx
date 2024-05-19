import React, { useEffect, useState } from "react";
import { ScheduledClass } from "./types/ScheduledClass";
import ScheduledClasses from "./components/ScheduledClasses";

function App() {
  const [classes, setClasses] = useState<ScheduledClass[]>([]);

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

  return (
    <div className="App">
      <ScheduledClasses classes={classes} />
    </div>
  );
}

export default App;
