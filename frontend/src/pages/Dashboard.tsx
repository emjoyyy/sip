import "./Dashboard.css";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user.first_name}! 👋</h1>
          <p>Here's your dashboard overview</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>👤 Profile Information</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">User ID:</span>
                <span className="info-value">#{user.id}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>📊 Account Stats</h3>
            </div>
            <div className="card-body">
              <div className="stat-item">
                <div className="stat-number">1</div>
                <div className="stat-label">Active Account</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Profile Complete</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>🔐 Security</h3>
            </div>
            <div className="card-body">
              <div className="security-info">
                <div className="security-item">
                  <span className="security-status active">● </span>
                  <span>Account is secure</span>
                </div>
                <div className="security-item">
                  <span className="security-status active">● </span>
                  <span>Password protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
