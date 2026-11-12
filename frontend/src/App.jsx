
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlayerDashboard from "./pages/PlayerDashboard";
import PlayerProfile from "./pages/PlayerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<PlayerDashboard />} />
          <Route path="/profile" element={<PlayerProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
