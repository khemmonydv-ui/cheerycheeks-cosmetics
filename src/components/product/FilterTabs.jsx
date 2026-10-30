// The row of pill buttons: All / Skincare / Lips / Face / Eyes
function FilterTabs({ categories, active, onChange }) {
  return (
    <div className="filters" role="tablist">
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={cat === active}
          className={cat === active ? 'pill active' : 'pill'}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;