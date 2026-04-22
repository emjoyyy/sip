import { useState } from "react";
import "./ProfileEdit.css";

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

interface ProfileEditProps {
  user: User;
  onNavigate: (page: string) => void;
  onProfileUpdate: (updatedUser: User) => void;
}

export default function ProfileEdit({
  user,
  onNavigate,
  onProfileUpdate,
}: ProfileEditProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async () => {
    if (!firstName || !lastName || !email) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          firstName,
          lastName,
          email,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
        return;
      }

      const updatedUser: User = {
        ...user,
        firstName,
        lastName,
        email,
      };

      setSuccess("Profile updated successfully!");
      onProfileUpdate(updatedUser);

      setTimeout(() => {
        onNavigate("profile");
      }, 1500);
    } catch {
      setError("Connection failed. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-content">
        <div className="edit-header">
          <h1>Edit Profile</h1>
          <p>Update your account information</p>
        </div>

        <div className="edit-card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input type="text" value={user.username} disabled />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigate("profile")}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}