import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Send the user back to the page they originally wanted
  const redirectTo = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const clearError = () => {
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      passwordRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ok = await login(cleanEmail, password);
      if (ok) {
        navigate(redirectTo, { replace: true });
      } else {
        setError('Wrong email or password. Please try again.');
        setPassword('');
        passwordRef.current?.focus();
      }
    } catch (err) {
      console.error('Login failed:', err);
      // While developing, show the real reason right on the form
      setError(
        import.meta.env.DEV
          ? `Login error: ${err?.message || err}`
          : 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form
        onSubmit={handleSubmit}
        className={`admin-login${error ? ' admin-login--error' : ''}`}
        noValidate
      >
        <h1 className="admin-login__title">Admin Login</h1>

        <div className="admin-login__field">
          <label htmlFor="admin-email" className="admin-login__label">
            Email
          </label>
          <input
            id="admin-email"
            ref={emailRef}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
            autoComplete="username"
            placeholder="admin@example.com"
            aria-invalid={!!error}
            className="admin-login__input admin-login__input--plain"
          />
        </div>

        <div className="admin-login__field">
          <label htmlFor="admin-password" className="admin-login__label">
            Password
          </label>

          <div className="admin-login__input-wrap">
            <input
              id="admin-password"
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!error}
              aria-describedby={error ? 'admin-login-error' : undefined}
              className="admin-login__input"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="admin-login__toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && (
            <p id="admin-login-error" role="alert" className="admin-login__error">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!email.trim() || !password || loading}
          className="admin-login__submit"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="admin-login__footer">
          Don&apos;t have an account?{' '}
          <Link to="/admin/signup" className="admin-login__link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}