import { useState } from "react";
import "./Auth.css";

interface AuthProps {
  onSwitchPage: (page: "login" | "register") => void;
}

export default function Register({ onSwitchPage }: AuthProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"student" | "company">("student");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (role === 'company' && !companyName) {
      setError("Company name is required for company accounts");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          first_name: firstName,
          last_name: lastName,
          role,
          company_name: role === 'company' ? companyName : null,
          phone: phone || null,
          bio: bio || null,
          password,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        onSwitchPage("login");
        setUsername("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setCompanyName("");
        setPhone("");
        setBio("");
        setPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      setError("Connection failed. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join us today</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "student" | "company")}
          >
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
        </div>

        {role === 'company' && (
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              id="companyName"
              type="text"
              placeholder="Tech Corp Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio (Optional)</label>
          <textarea
            id="bio"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              className="link-btn"
              onClick={() => onSwitchPage("login")}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
