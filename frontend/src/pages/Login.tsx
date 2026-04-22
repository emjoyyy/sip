import { useState } from "react";
import "./Auth.css";

interface AuthProps {
  onSwitchPage: (page: "login" | "register") => void;
  onLoginSuccess?: (user: any) => void;
}

export default function Login({ onSwitchPage, onLoginSuccess }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        setError(errorMsg);
        return;
      }

      const userData = await response.json();
      setSuccess("Login successful!");
      setEmail("");
      setPassword("");
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
      }, 500);
    } catch (err) {
      setError("Connection failed. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              className="link-btn"
              onClick={() => onSwitchPage("register")}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
