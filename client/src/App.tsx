import { ErrorBoundary } from "react-error-boundary";
import Fallback from "./components/ErrorBoundary";
import TreePage from "./pages/TreePage";
import { logErrorToBackend } from "./utils/logError";

function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onError={logErrorToBackend}>
      <div className="min-h-screen bg-gray-100">
        <div className="App">
          <header className="bg-white shadow-sm px-6 py-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Node Tree Manager
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your hierarchical datastructure with ease
            </p>
          </header>

          <main className="container mx-auto px-6 py-8">
            <TreePage />
          </main>

          <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
            <p className="text-gray-600 text-center">
              &copy; 2025 Node Tree Manager - Farzana Shaneez
            </p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
