import { useState, useEffect } from "react";
import "./AdminPanel.css";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'company' | 'admin';
  company_name?: string;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  pendingApplications: number;
}

interface AdminPanelProps {
  user: any;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole as any } : user
        ));
        alert('User role updated successfully');
      } else {
        alert('Failed to update user role');
      }
    } catch (err) {
      alert('Error updating user role');
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage users and monitor platform activity</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalJobs}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.activeJobs}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pendingApplications}</div>
            <div className="stat-label">Pending Applications</div>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
        </div>

        <div className="users-table">
          <div className="table-header">
            <div className="col">Name</div>
            <div className="col">Email</div>
            <div className="col">Role</div>
            <div className="col">Company</div>
            <div className="col">Joined</div>
            <div className="col">Actions</div>
          </div>

          {users.map(user => (
            <div key={user.id} className="table-row">
              <div className="col">
                {user.first_name} {user.last_name}
                <div className="username">@{user.username}</div>
              </div>
              <div className="col">{user.email}</div>
              <div className="col">
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </div>
              <div className="col">{user.company_name || '-'}</div>
              <div className="col">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
              <div className="col">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                  disabled={user.id === user.id} // Prevent self-demotion
                >
                  <option value="student">Student</option>
                  <option value="company">Company</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}