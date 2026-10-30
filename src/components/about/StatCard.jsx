/**
 * Props: value (e.g. "10+"), label
 */
export default function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
}