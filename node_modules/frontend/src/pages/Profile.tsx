import "./Profile.css";

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

interface ProfileProps {
  user: User;
  onNavigate: (page: string) => void;
}

export default function Profile({ user, onNavigate }: ProfileProps) {
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.firstName.charAt(0).toUpperCase()}
            {user.lastName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-header-info">
            <h1>
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-username">@{user.username}</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onNavigate("profile-edit")}
          >
            ✏️ Edit Profile
          </button>
        </div>

        <div className="profile-card">
          <h2>Account Information</h2>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <label>First Name</label>
              <p>{user.firstName}</p>
            </div>

            <div className="profile-info-item">
              <label>Last Name</label>
              <p>{user.lastName}</p>
            </div>

            <div className="profile-info-item">
              <label>Username</label>
              <p>{user.username}</p>
            </div>

            <div className="profile-info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="profile-info-item">
              <label>User ID</label>
              <p>#{user.id}</p>
            </div>

            <div className="profile-info-item">
              <label>Status</label>
              <p className="status-active">🟢 Active</p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate("dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}