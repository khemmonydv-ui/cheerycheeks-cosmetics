import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export default function AdminSignup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!EMAIL_REGEX.test(form.email.trim())) return 'Please enter a valid email address.';
    if (form.password.length < MIN_PASSWORD)
      return `Password must be at least ${MIN_PASSWORD} characters.`;
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (result?.ok) {
        navigate('/admin', { replace: true });
      } else {
        setError(result?.error || 'Could not create the account.');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      // While developing, show the real reason right on the form
      setError(
        import.meta.env.DEV
          ? `Signup error: ${err?.message || err}`
          : 'Something went wrong. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordType = showPassword ? 'text' : 'password';

  return (
    <div className="admin-login-page">
      <form
        onSubmit={handleSubmit}
        className={`admin-login${error ? ' admin-login--error' : ''}`}
        noValidate
      >
        <h1 className="admin-login__title">Create Account</h1>

        <div className="admin-login__field">
          <label htmlFor="signup-name" className="admin-login__label">
            Name
          </label>
          <input
            id="signup-name"
            ref={nameRef}
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Your full name"
            className="admin-login__input admin-login__input--plain"
          />
        </div>

        <div className="admin-login__field">
          <label htmlFor="signup-email" className="admin-login__label">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            inputMode="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="admin@example.com"
            className="admin-login__input admin-login__input--plain"
          />
        </div>

        <div className="admin-login__field">
          <label htmlFor="signup-password" className="admin-login__label">
            Password
          </label>
          <div className="admin-login__input-wrap">
            <input
              id="signup-password"
              name="password"
              type={passwordType}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder={`At least ${MIN_PASSWORD} characters`}
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
        </div>

        <div className="admin-login__field">
          <label htmlFor="signup-confirm" className="admin-login__label">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            name="confirm"
            type={passwordType}
            value={form.confirm}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={!!form.confirm && form.confirm !== form.password}
            aria-describedby={error ? 'signup-error' : undefined}
            className="admin-login__input admin-login__input--plain"
          />
          {error && (
            <p id="signup-error" role="alert" className="admin-login__error">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            !form.name.trim() || !form.email.trim() || !form.password || !form.confirm || loading
          }
          className="admin-login__submit"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="admin-login__footer">
          Already have an account?{' '}
          <Link to="/admin/login" className="admin-login__link">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}