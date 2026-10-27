// categories = [{ name, stock }]  (stock = total units in that category)
export default function CategoryStockCard({ categories }) {
  const max = Math.max(1, ...categories.map((c) => c.stock));

  return (
    <section className="dash-card">
      <h2>Stock by category</h2>

      {categories.length === 0 ? (
        <p className="dash-empty">No products yet.</p>
      ) : (
        <div className="dash-cats">
          {categories.map((c) => {
            // the longest bar is the category with the most stock
            const percent = c.stock === 0 ? 0 : Math.max(4, (c.stock / max) * 100);
            return (
              <div key={c.name} className="dash-cat">
                <span className="dash-cat-name">{c.name}</span>
                <div className="dash-track" role="img" aria-label={`${c.name}: ${c.stock} in stock`}>
                  <div className="dash-fill" style={{ width: `${percent}%` }} />
                </div>
                <span className="dash-cat-num">{c.stock}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}