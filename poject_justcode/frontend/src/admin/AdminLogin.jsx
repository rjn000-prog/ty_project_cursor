import { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/admin/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
      <h2>Admin Login</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD WITH EYE */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
