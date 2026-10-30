function FilterTabs({
  categories = [],
  selectedCategory = 'all',
  setSelectedCategory,
}) {
  const categoryList = Array.isArray(categories)
    ? categories
    : [];

  const handleCategoryClick = (categoryValue) => {
    if (typeof setSelectedCategory === 'function') {
      setSelectedCategory(categoryValue);
    }
  };

  return (
    <div className="filter-tabs">
      {/* All Products button */}
      <button
        type="button"
        className={`filter-tab ${
          String(selectedCategory).toLowerCase() === 'all'
            ? 'active'
            : ''
        }`}
        onClick={() => handleCategoryClick('all')}
      >
        All Products
      </button>

      {/* Category buttons */}
      {categoryList.map((category, index) => {
        const isObject =
          category !== null && typeof category === 'object';

        const categoryName = isObject
          ? category.name
          : category;

        const categoryId = isObject
          ? category.id
          : category;

        if (
          typeof categoryName !== 'string' ||
          !categoryName.trim()
        ) {
          return null;
        }

        const categoryValue = categoryName.trim();

        const isActive =
          String(selectedCategory).toLowerCase() ===
          categoryValue.toLowerCase();

        return (
          <button
            type="button"
            key={`${categoryId ?? categoryValue}-${index}`}
            className={`filter-tab ${isActive ? 'active' : ''}`}
            onClick={() => handleCategoryClick(categoryValue)}
          >
            {categoryValue}
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;