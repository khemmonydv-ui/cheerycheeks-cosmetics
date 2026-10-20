// tone: "neutral" (purple-grey) or "warn" (orange)
export default function StatCard({ value, label, icon, tone = 'neutral' }) {
  return (
    <div className="adm-stat">
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <span className={`adm-stat-icon is-${tone}`}>{icon}</span>
    </div>
  );
}