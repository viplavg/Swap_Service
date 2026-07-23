import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const employeeLinks = [
    { label: "Dashboard", path: "/employee-dashboard" },
    { label: "My Shifts", path: "/employee-dashboard/shifts" },
    { label: "My Requests", path: "/employee-dashboard/requests" },
    { label: "Create Swap", path: "/employee-dashboard/create-swap" },
  ];

  const managerLinks = [
    { label: "Dashboard", path: "/manager-dashboard" },
    { label: "All Shifts", path: "/manager-dashboard/shifts" },
    { label: "Create Shift", path: "/manager-dashboard/create-shift" },
    { label: "Pending Requests", path: "/manager-dashboard/pending-requests" },
  ];

  const links =
    user?.role === "MANAGER" ? managerLinks : employeeLinks;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">SS</div>

          <div>
            <h2>Shift Swap</h2>
            <p>Workforce Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="user-details">
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="header-label">Shift Swap Portal</p>
            <h1>Welcome, {user?.name}</h1>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;