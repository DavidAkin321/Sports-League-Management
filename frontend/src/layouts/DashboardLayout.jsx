import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>SportLeague</h2>

                <nav>
                    <p>MENU</p>
                    <a href="#">Dashboard</a>
                    <a href="#">My Teams</a>
                    <a href="#">Fixtures</a>
                    <a href="#">Results</a>
                    <a href="#">Standings</a>
                </nav>
            </aside>

            <main className="main-content">
                <header className="dashboard-header">
                    <h2>Dashboard</h2>
                    <span>Welcome back</span>
                </header>

                <section className="dashboard-content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default DashboardLayout;