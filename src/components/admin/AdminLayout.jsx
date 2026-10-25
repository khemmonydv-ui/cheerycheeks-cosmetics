import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './admin.css';

export default function AdminLayout() {
  return (
    <div className="adm-shell">
      <Sidebar />
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}