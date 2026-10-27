import { SORT_OPTIONS } from '../../utils/sortProducts';

// "Sort by" dropdown. The chosen value lives in the Products page.
function SortSelect({ value, onChange }) {
  return (
    <label className="sort">
      <span className="sort-label">Sort by</span>
      <select className="sort-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default SortSelect;