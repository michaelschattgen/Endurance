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

          <div className="p-5 sm:min-h-2/4 min-h-3/4 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl mb-5">
            <Routes>
              <Route path="/select-venue" element={<VenueSelectionComponent />} />
              <Route path="/" element={<ClassSelector />} />
            </Routes>
          </div>
          <footer className="text-gray-700 dark:text-gray-200 ">
            <div className="p-2 pl-4 flex font-extralight flex-row justify-between ">
              <div>
                Built with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://schattgen.nl"
                  className="font-bold hover:border-b-2 border-dotted border-gray-800 dark:border-gray-400"
                >
                  Michael Schättgen
                </a>
              </div>
              <div className="block">
                <a
                  href="https://github.com/michaelschattgen/Endurance"
                  aria-label="GitHub repository"
                >
                  <svg
                    className="h-6 w-6 fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.332-1.756-1.332-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.303 3.492.997.108-.775.419-1.303.762-1.603-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.469-2.382 1.237-3.221-.124-.306-.536-1.533.117-3.194 0 0 1.008-.322 3.301 1.23.956-.266 1.983-.399 3.004-.404 1.02.005 2.048.138 3.004.404 2.293-1.552 3.301-1.23 3.301-1.23.653 1.661.241 2.888.118 3.194.77.839 1.237 1.911 1.237 3.221 0 4.609-2.807 5.624-5.479 5.92.43.372.823 1.102.823 2.222v3.293c0 .322.194.694.801.576C20.565 21.795 24 17.296 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
