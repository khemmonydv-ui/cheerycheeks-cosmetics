import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) navigate('/admin');
    else setError('Wrong password');
  };

  return (
    <form onSubmit={handleSubmit} className="admin-login">
      <h1>Admin Login</h1>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log in</button>
      {error && <p>{error}</p>}
    </form>
  );
}