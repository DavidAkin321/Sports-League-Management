
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import PlayerDashboard from "./pages/PlayerDashboard";
import PlayerProfile from "./pages/PlayerProfile";
import MyTeams from "./pages/MyTeams";
import Fixtures from "./pages/Fixtures";
import Results from "./pages/Results";
import Standings from "./pages/Standings";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public authentication page */}
        <Route path="/login" element={<Login />} />

        {/* Protected application pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<PlayerDashboard />} />
            <Route path="/profile" element={<PlayerProfile />} />
            <Route path="/teams" element={<MyTeams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/results" element={<Results />} />
            <Route path="/standings" element={<Standings />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
