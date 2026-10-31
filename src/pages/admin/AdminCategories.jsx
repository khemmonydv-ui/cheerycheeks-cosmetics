import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProducts } from '../../context/ProductsContext';
import {
  applyCategoryChanges,
  deleteCategory,
  nextCategoryId,
  saveCategory,
  CATEGORIES_CHANGED,
} from '../../utils/adminCategories';
import { Modal, StatCard } from '../../components/admin/SalesUi';

// Pictures already in public/images/products/ (add a new file name here when you add a picture)
const PICTURES = [
  'skincare1.jpg', 'skincare2.jpg', 'skincare3.jpg', 'skincare4.jpg', 'skincare5.jpg', 'skincare6.jpg',
  'make-up.jpg', 'lip1.jpg', 'lips.jpg', 'blush.jpg', 'blush1.jpg',
  'Haircare.jpg', 'Haircare1.jpg', 'Haircare2.jpg',
  'bodycare.jpg', 'bodycare1.jpg', 'bodycare2.jpg', 'bodycare3.jpg',
  'Fragrance.jpg', 'Fragrance2.jpg', 'Fragrance3.jpg', 'Fragrance4.jpg',
];

const MAX_SIDE = 600;

// Read an image file, shrink it, and return it as a text string (data URL)
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('This file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- Add / edit form (inside a pop-up) ---------- */
function CategoryForm({ category, categories, onSave, onClose }) {
  const isNew = !category;
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '',
  });
  const [error, setError] = useState('');

  const set = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG or WebP).');
      return;
    }
    try {
      const image = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, image }));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function submit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError('Please enter a category name.');
      return;
    }
    const taken = categories.some(
      (c) => c.id !== category?.id && c.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (taken) {
      setError('A category with this name already exists.');
      return;
    }
    const saved = onSave({
      id: category?.id ?? nextCategoryId(categories),
      name,
      description: form.description.trim(),
      image: form.image,
    }, isNew);
    if (!saved) setError('Could not save. The picture may be too large.');
  }

  return (
    <form className="sales-form" onSubmit={submit}>
      <label className="sales-field">
        Name
        <input className="sales-input" name="name" value={form.name} onChange={set} required />
      </label>

      <label className="sales-field">
        Description
        <textarea
          className="sales-input"
          name="description"
          rows={3}
          maxLength={200}
          placeholder="A short line shown to customers"
          value={form.description}
          onChange={set}
        />
      </label>

      <div className="sales-field">
        Picture
        <div className="sales-upload">
          <span className="sales-thumb sales-thumb--big">
            {form.image ? <img src={form.image} alt="Category preview" /> : null}
          </span>
          <div className="sales-upload__actions">
            <label className="sales-btn">
              {form.image ? 'Change picture' : 'Upload picture'}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} hidden />
            </label>
            {form.image && (
              <button type="button" className="sales-btn sales-btn--danger" onClick={() => setForm({ ...form, image: '' })}>
                Remove
              </button>
            )}
          </div>
        </div>

        <select
          className="sales-input"
          aria-label="Or choose a picture from the shop"
          value={PICTURES.some((n) => form.image === `/images/products/${n}`) ? form.image : ''}
          onChange={(e) => e.target.value && setForm({ ...form, image: e.target.value })}
        >
          <option value="">Or choose a picture from the shop...</option>
          {PICTURES.map((n) => (
            <option key={n} value={`/images/products/${n}`}>{n}</option>
          ))}
        </select>
      </div>

      {error && <p className="sales-form__error" role="alert">{error}</p>}

      <div className="sales-form__actions">
        <button type="button" className="sales-btn" onClick={onClose}>Cancel</button>
        <button type="submit" className="sales-btn sales-btn--solid">
          {isNew ? 'Add category' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

/* ---------- Page ---------- */
export default function AdminCategories() {
  const { products } = useProducts(); // to count the products in each category

  const [jsonCategories, setJsonCategories] = useState([]);
  const [changesTick, setChangesTick] = useState(0); // goes up when the admin saves something
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [query, setQuery] = useState('');
  const [form, setForm] = useState(null);       // null | 'new' | category being edited
  const [removing, setRemoving] = useState(null); // category waiting for "are you sure"

  // ---------- Load categories.json with async / await ----------
  useEffect(() => {
    const controller = new AbortController();

    async function getCategories() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${import.meta.env.BASE_URL}products-data/categories.json`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Could not load categories (HTTP ${response.status})`);

        const data = await response.json();
        // Supports both [ ...categories ] and { "categories": [ ...categories ] }.
        const list = Array.isArray(data) ? data : data.categories;
        if (!Array.isArray(list)) {
          throw new Error('categories.json must be an array or an object with a categories array.');
        }

        setJsonCategories(list);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    getCategories();
    return () => controller.abort();
  }, [attempt]);

  // refresh the list when a change is saved (also from another tab)
  useEffect(() => {
    const bump = () => setChangesTick((n) => n + 1);
    window.addEventListener(CATEGORIES_CHANGED, bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener(CATEGORIES_CHANGED, bump);
      window.removeEventListener('storage', bump);
    };
  }, []);

  // categories.json + the admin's changes, with the number of products in each
  const categories = useMemo(
    () =>
      applyCategoryChanges(jsonCategories).map((category) => ({
        ...category,
        productCount: products.filter(
          (p) => p.categoryId === category.id || p.category === category.name
        ).length,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jsonCategories, products, changesTick]
  );

  const text = query.trim().toLowerCase();
  const visible = categories.filter((c) =>
    `${c.name} ${c.description || ''}`.toLowerCase().includes(text)
  );

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);
  const withPicture = categories.filter((c) => c.image).length;

  const closeForm = useCallback(() => setForm(null), []);
  const closeRemove = useCallback(() => setRemoving(null), []);

  function handleSave(category, isNew) {
    const saved = saveCategory(category, isNew);
    if (saved) setForm(null);
    return saved;
  }

  function handleRemove() {
    deleteCategory(removing.id);
    setRemoving(null);
  }

  return (
    <section className="sales-page">
      <header className="sales-head sales-head--row">
        <div>
          <h1>Categories</h1>
          <p>The categories shown on the shop, from categories.json.</p>
        </div>
        <button type="button" className="sales-btn sales-btn--solid" onClick={() => setForm('new')}>
          + Add category
        </button>
      </header>

      <div className="sales-stats">
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Products" value={totalProducts} hint="In all categories" />
        <StatCard label="With a picture" value={withPicture} />
        <StatCard label="Empty" value={categories.filter((c) => c.productCount === 0).length} hint="No products yet" />
      </div>

      <div className="sales-toolbar">
        <span />
        <input
          className="sales-search"
          type="search"
          placeholder="Search categories"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search categories"
        />
      </div>

      {loading && <p className="sales-empty">Loading categories...</p>}

      {!loading && error && (
        <div className="sales-empty" role="alert">
          <p>{error}</p>
          <button type="button" className="sales-btn" onClick={() => setAttempt((n) => n + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p className="sales-empty">
          {categories.length === 0 ? 'No categories yet. Add your first one.' : 'No categories match your search.'}
        </p>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Products</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((category) => (
                <tr key={category.id}>
                  <td data-label="Category">
                    <span className="sales-person">
                      <span className="sales-thumb">
                        {category.image ? <img src={category.image} alt="" loading="lazy" /> : null}
                      </span>
                      <strong>{category.name}</strong>
                    </span>
                  </td>
                  <td data-label="Description">{category.description || '-'}</td>
                  <td data-label="Products"><strong>{category.productCount}</strong></td>
                  <td>
                    <span className="sales-actions">
                      <button type="button" className="sales-btn" onClick={() => setForm(category)}>Edit</button>
                      <button type="button" className="sales-btn sales-btn--danger" onClick={() => setRemoving(category)}>
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal title={form === 'new' ? 'Add category' : `Edit ${form.name}`} onClose={closeForm}>
          <CategoryForm
            category={form === 'new' ? null : form}
            categories={categories}
            onSave={handleSave}
            onClose={closeForm}
          />
        </Modal>
      )}

      {removing && (
        <Modal title={`Delete ${removing.name}?`} onClose={closeRemove}>
          {removing.productCount > 0 ? (
            <p className="sales-note">
              This category still has {removing.productCount}{' '}
              {removing.productCount === 1 ? 'product' : 'products'}. Move or delete them first,
              then you can delete the category.
            </p>
          ) : (
            <p className="sales-note">This removes the category from the shop. This cannot be undone.</p>
          )}
          <div className="sales-form__actions">
            <button type="button" className="sales-btn" onClick={closeRemove}>Cancel</button>
            <button
              type="button"
              className="sales-btn sales-btn--solid sales-btn--delete"
              disabled={removing.productCount > 0}
              onClick={handleRemove}
            >
              Delete category
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}