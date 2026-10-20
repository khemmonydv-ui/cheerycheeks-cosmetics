import { Search } from 'lucide-react';

// A controlled input: the text lives in Collection.jsx and comes in as "value"
function SearchBar({ value, onChange, placeholder = 'Search products, e.g. serum or lip...' }) {
  return (
    <div className="search">
      <Search size={18} className="search-icon" aria-hidden="true" />
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
      />
    </div>
  );
}

export default SearchBar;