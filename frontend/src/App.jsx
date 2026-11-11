import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PlayerDashboard from "./pages/PlayerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={<PlayerDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;