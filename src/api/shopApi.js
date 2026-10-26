// Reads the teacher's JSON files from public/student-data/.
// Only the files that have a relationship with the product page are used:
//   products.json    -> the products (categoryId points to categories.id)
//   categories.json  -> the category names
//   invoices.json    -> units sold per product (productId points to products.id)
const DATA_URL = `${import.meta.env.BASE_URL}student-data`;

async function getJson(file, signal) {
  const response = await fetch(`${DATA_URL}/${file}.json`, { signal });
  if (!response.ok) {
    throw new Error(`Could not load ${file}.json (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error(`${file}.json should contain a list`);
  }
  return data;
}

// Products and categories are required. Invoices only add the "Bestseller"
// badge, so if they fail to load the shop still works without them.
export async function loadShopData(signal) {
  const [products, categories, invoices] = await Promise.all([
    getJson('products', signal),
    getJson('categories', signal),
    getJson('invoices', signal).catch((err) => {
      if (err.name === 'AbortError') throw err;
      return [];
    }),
  ]);
  return { products, categories, invoices };
}

// Total units sold per productId, counting PAID invoices only.
// Returns a Map: productId -> units sold.
export function countSold(invoices) {
  const sold = new Map();
  for (const invoice of invoices) {
    if (invoice.status !== 'PAID') continue;
    for (const item of invoice.items ?? []) {
      sold.set(item.productId, (sold.get(item.productId) ?? 0) + item.quantity);
    }
  }
  return sold;
}