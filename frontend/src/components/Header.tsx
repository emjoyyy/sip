import { useState } from "react";
import "./Header.css";

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  role: "student" | "company" | "admin";
  company_name?: string;
}

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export default function Header({ user, onLogout, onNavigate }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    onLogout();
  };

  const getDashboardLabel = () => {
    if (user.role === "student") return "📋 Jobs";
    if (user.role === "company") return "🏢 Company Dashboard";
    if (user.role === "admin") return "⚙️ Admin Panel";
    return "📊 Dashboard";
  };

  const getDashboardPage = () => {
    if (user.role === "student") return "jobs";
    if (user.role === "company") return "company-dashboard";
    if (user.role === "admin") return "admin-panel";
    return "dashboard";
  };

  let name = "User";

  if (user.first_name) name = user.first_name;
  else if (user.firstName) name = user.firstName;
  else if (user.username) name = user.username;

  const firstLetter = name[0].toUpperCase();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h2>Internship Platform</h2>
        </div>

        <div className="header-user-menu">
          <button
            className="user-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="user-avatar">{firstLetter}</span>
            <span className="user-name">{name}</span>
            <span className="menu-arrow">▼</span>
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  onNavigate(getDashboardPage());
                  setShowMenu(false);
                }}
              >
                {getDashboardLabel()}
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onNavigate("profile");
                  setShowMenu(false);
                }}
              >
                👤 View Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  onNavigate("profile-edit");
                  setShowMenu(false);
                }}
              >
                ✏️ Edit Profile
              </button>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}