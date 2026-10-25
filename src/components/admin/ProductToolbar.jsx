import { SearchIcon, ChevronIcon } from './Icons';

export default function ProductToolbar({
  query, onQueryChange, category, onCategoryChange, categories, onAdd,
}) {
  return (
    <div className="adm-toolbar">
      <label className="adm-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search products"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>

      <label className="adm-select">
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <ChevronIcon />
      </label>

      <button className="adm-btn-primary" onClick={onAdd}>Add product</button>
    </div>
  );
}