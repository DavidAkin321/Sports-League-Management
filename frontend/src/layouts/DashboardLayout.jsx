
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>SportLeague</h2>

        <nav>
          <p>MENU</p>

          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/profile">My Profile</NavLink>
          <NavLink to="/teams">My Teams</NavLink>
          <NavLink to="/fixtures">Fixtures</NavLink>
          <NavLink to="/results">Results</NavLink>
          <NavLink to="/standings">Standings</NavLink>
        </nav>

        <div className="sidebar-user">
          <p>{user?.name}</p>
          <span>{user?.role}</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <span>Welcome back, {user?.name}!</span>
        </header>

        <section className="dashboard-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
