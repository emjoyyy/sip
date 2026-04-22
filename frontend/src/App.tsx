import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Jobs from "./pages/Jobs";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminPanel from "./pages/AdminPanel";
import Header from "./components/Header";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "company" | "admin";
  company_name?: string;
  phone?: string;
  bio?: string;
}

type Page =
  | "login"
  | "register"
  | "dashboard"
  | "profile"
  | "profile-edit"
  | "jobs"
  | "company-dashboard"
  | "admin-panel";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("login");
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <>
      {user && (
        <Header
          user={user}
          onLogout={handleLogout}
          onNavigate={(page) => handleNavigate(page as Page)}
        />
      )}

      {!user && currentPage === "login" && (
        <Login
          onSwitchPage={(page) => setCurrentPage(page as Page)}
          onLoginSuccess={handleLogin}
        />
      )}

      {!user && currentPage === "register" && (
        <Register
          onSwitchPage={(page) => setCurrentPage(page as Page)}
        />
      )}

      {user && currentPage === "dashboard" && (
        <>
          {user.role === "student" && <Jobs user={user} />}
          {user.role === "company" && (
            <CompanyDashboard user={user} />
          )}
          {user.role === "admin" && (
            <AdminPanel user={user} />
          )}
        </>
      )}

      {user && currentPage === "profile" && (
        <Profile
          user={user}
          onNavigate={(page) => handleNavigate(page as Page)}
        />
      )}

      {user && currentPage === "profile-edit" && (
        <ProfileEdit
          user={user}
          onNavigate={(page) => handleNavigate(page as Page)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {user && currentPage === "jobs" && (
        <Jobs user={user} />
      )}

      {user && currentPage === "company-dashboard" && (
        <CompanyDashboard user={user} />
      )}

      {user && currentPage === "admin-panel" && (
        <AdminPanel user={user} />
      )}
    </>
  );
}

export default App;