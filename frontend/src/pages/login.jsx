import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5134/api/auth/login",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          email,
         password,
        }),
        }
      );
      if (!response.ok) {
        setError("Invalid email or password.");
        return;
      }

    const data = await response.json();
    console.log("Login successful:", data);
      onLogin(data);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
       <div className="login-logo">
        Handover<span>Hub</span>
      </div>
       <h1>Welcome back</h1>
       <p className="login-subtitle">
        Sign in to manage your work handovers.
       </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
        <label htmlFor="email">Email</label>
       <input
          id="email"
           type="email"
        placeholder="Enter your email"
          value={email}
         onChange={(event) => setEmail(event.target.value)}
        required
            />
          </div>
          <div className="form-group">
           <label>Password</label>
          <input
            id="password"
          type="password"
            placeholder="Enter your password"
           value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            />
          </div>
          {error && (
          <p className="login-error">{error}
            </p>
          )}

          <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
     </button>
     </form>
    </div>
    </div>
  );
}

export default Login;