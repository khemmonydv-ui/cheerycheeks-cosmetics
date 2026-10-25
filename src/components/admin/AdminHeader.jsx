export default function AdminHeader({ title, subtitle, name = 'Admin', role = 'administrator' }) {
  return (
    <header className="adm-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="adm-user">
        <span className="adm-avatar">{name.charAt(0)}</span>
        <span className="adm-user-text">
          <strong>{name}</strong>
          <small>{role}</small>
        </span>
      </div>
    </header>
  );
}