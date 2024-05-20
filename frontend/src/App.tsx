import { Route, Routes, useNavigate } from "react-router-dom";
import ClassSelector from "./ClassSelector";
import VenueSelectionComponent from "./VenueSelection";
import { Toaster } from "sonner";
import VenueHeader from "./components/VenueHeader";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className={`flex justify-center min-h-screen bg-gray-100 font-geist py-0 md:py-2`}>
        <div className="w-full max-w-4xl">
          <div className="p-2 pl-4 flex flex-row justify-between">
            <h1 className="font-display text-3xl font-extrabold text-gray-700 sm:text-4xl">
              Endurance
            </h1>
            <VenueHeader
              onClick={() => {
                navigate("/select-venue");
              }}
            />
          </div>

          <div className="p-5 sm:min-h-2/4 min-h-3/4 bg-white shadow-lg rounded-2xl">
            <Routes>
              <Route path="/select-venue" element={<VenueSelectionComponent />} />
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
