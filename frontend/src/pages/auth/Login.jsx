import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify({ ...data.user, role: data.role }));

      if (data.role === "student") navigate("/dashboard");
      else if (data.role === "club_admin") navigate("/club-admin");
      else if (data.role === "sports_admin") navigate("/sports-admin");
      else if (data.role === "super_admin") navigate("/admin");
      else navigate("/unauthorized");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src="/logo.svg" alt="PCCAS" />
          <span className="login-logo-text">PCCAS Sports & Events Portal</span>
        </div>

        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Sign in to access your student or admin dashboard
        </p>

        {error && (
          <div className="login-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">College Email</label>
            <div className="input-wrap">
              <span className="input-icon">✉️</span>
              <input
                id="email"
                type="email"
                placeholder="student@chowgule.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <hr className="login-divider" />

        <div className="login-footer">
          <p>🔒 Secure portal — only authorized college users can access.</p>
        </div>
      </div>
    </div>
  );
}
