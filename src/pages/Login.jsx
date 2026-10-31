import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAccounts } from "../api/accounts";
import "./Login.css";
import "./Signup.css";



export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // Set by the "please log in" alert: the page to return to, and a message to show
  const backTo = location.state?.from ?? "/account";
  const notice = location.state?.notice;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const accountsData = await getAccounts();
      const saved = JSON.parse(localStorage.getItem("accounts")) || [];
      const all = [...accountsData, ...saved];

      const user = all.find(
        (a) =>
          a.email === form.email &&
          // Account from JSON without password → Accept via email only
          (a.password === undefined || a.password === form.password),
      );

      if (!user) {
        setError("Email or password is incorrect.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(backTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Cannot load accounts. Please try again.");
    }
  }

  return (
    <main className="signup-page">
      <div className="container">
        <form className="signup-card" onSubmit={handleSubmit}>
          <div className="signup-head">
            <p className="eyebrow">Cherry Cheeks</p>
            <h1 className="signup-title">Welcome back</h1>
            <p className="signup-sub">Log in to your account.</p>
          </div>

          <div className="signup-field">
            <label htmlFor="email">Email</label>
            <input
              className="input"
              id="email"
              type="email"
              placeholder="name@email.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {notice && <p className="signup-notice">{notice}</p>}
          {error && (
            <p className="signup-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block">
            Log in
          </button>

          <p className="signup-switch">
            No account?{" "}
            <Link to="/signup" state={location.state}>
              Sign up
            </Link>
          </p>

          <Link to="/" className="signup-back">
            <span aria-hidden="true">&larr;</span> Back to home
          </Link>
        </form>
      </div>
    </main>
  );
}
