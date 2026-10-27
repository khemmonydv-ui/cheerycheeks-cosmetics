import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoutIcon } from './Icons';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/massage', label: 'Massage' },
];


export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="adm-sidebar">
      <div className="adm-brand">
        {/* Put your logo file at public/logo.png */}
        <img src="/Logo.png" alt="Cherry Cheeks" />
      </div>

      <nav className="adm-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `adm-nav-link${isActive ? ' is-active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <button className="adm-logout" onClick={handleLogout}>
        <LogoutIcon /> Logout
      </button>
    </aside>
  );
}