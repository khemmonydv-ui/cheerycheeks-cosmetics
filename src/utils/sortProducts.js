export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'popular', label: 'Most popular' },
];

// Returns a NEW sorted list. "featured" keeps the order of products.json,
// "popular" puts the products with the most units sold (from invoices.json) first.
export function sortProducts(list, key) {
  const sorted = [...list];
  switch (key) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'popular':
      return sorted.sort((a, b) => b.sold - a.sold);
    default:
      return sorted;
  }
}
