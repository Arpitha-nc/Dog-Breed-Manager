import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ToastContainer";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import BreedDetail from "./pages/BreedDetail";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/alldogs" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/breed/:name" element={<BreedDetail />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
