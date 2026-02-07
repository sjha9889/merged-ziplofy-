import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/admin-auth.context";
import "./AdminLogin.css";

const AdminLogin: React.FC = () => {
  const { login, loading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <div className="error">{error}</div>}
        <label>Email - updated</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password - updated</label>
        <div className="password-field">
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="toggle" type="button" onClick={() => setShow(s => !s)}>{show ? "Hide" : "Show"}</button>
        </div>
        <button className="submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        <p className="hint">Use your admin credentials to continue.</p>
      </form>
    </div>
  );
};

export default AdminLogin;
