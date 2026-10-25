// tone: "neutral" (purple-grey) or "warn" (orange). icon is optional.
export default function StatCard({ value, label, icon, tone = 'neutral' }) {
  return (
    <div className="adm-stat">
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      {icon && <span className={`adm-stat-icon is-${tone}`}>{icon}</span>}
    </div>
  );
}