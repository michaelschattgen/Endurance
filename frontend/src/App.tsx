import { Route, Routes, useNavigate } from "react-router-dom";
import ClassSelector from "./ClassSelector";
import VenueSelectionComponent from "./VenueSelection";
import { Toaster } from "sonner";
import VenueHeader from "./components/VenueHeader";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div
        className={`flex justify-center min-h-screen bg-gray-100 dark:bg-zinc-950 font-geist py-0 md:py-2`}
      >
        <div className="w-full max-w-4xl">
          <div className="p-2 pl-4 flex flex-row justify-between">
            <div
              className="flex items-center gap-x-2 hover:cursor-pointer"
              onClick={() => {
                navigate("/select-venue");
              }}
            >
              <h1 className="font-display font-extrabold text-gray-700 dark:text-gray-200 text-3xl">
                Endurance
              </h1>
              
              <VenueHeader />
            </div>

            <DarkModeToggle />
          </div>

          <div className="p-5 sm:min-h-2/4 min-h-3/4 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl">
            <Routes>
              <Route
                path="/select-venue"
                element={<VenueSelectionComponent />}
              />
              <Route path="/" element={<ClassSelector />} />
            </Routes>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
