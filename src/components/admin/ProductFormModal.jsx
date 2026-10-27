import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';

const empty = { name: '', category: '', description: '', price: '', stock: '', image: '', visible: true };

const MAX_SIDE = 600; // pictures are shrunk to this size so they stay small when saved

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
        ctx.fillStyle = '#ffffff'; // white background for transparent PNGs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// product = null  → add mode, product = {...} → edit mode
export default function ProductFormModal({ product, onSave, onClose }) {
  const { categories } = useProducts(); // from categories.json
  const [form, setForm] = useState(product ? { ...empty, ...product } : empty);
  const [error, setError] = useState('');

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // lets you pick the same file again later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG or WebP).');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price), stock: Number(form.stock) });
  };

  return (
    <div className="adm-overlay" onClick={onClose}>
      <form className="adm-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{product ? 'Edit product' : 'Add product'}</h2>

        <div className="adm-modal-body">
          <label>Name
            <input name="name" value={form.name} onChange={set} required />
          </label>
          <label>Category
            <select name="category" value={form.category} onChange={set} required>
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>

          <label>Description
            <textarea
              name="description"
              rows={4}
              maxLength={500}
              placeholder="Tell customers what this product is and why they will love it"
              value={form.description}
              onChange={set}
            />
          </label>
  
          <div className="adm-row">
            <label>Price ($)
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={set} required />
            </label>
            <label>Stock
              <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={set} required />
            </label>
          </div>
  
          <div className="adm-field">
            <span>Image</span>
            <div className="adm-upload">
              <span className="adm-upload-preview">
                {form.image ? <img src={form.image} alt="Product preview" /> : null}
              </span>
              <div className="adm-upload-actions">
                <label className="adm-btn-outline adm-file-btn">
                  {form.image ? 'Change image' : 'Choose image'}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFile}
                    hidden
                  />
                </label>
                {form.image && (
                  <button
                    type="button"
                    className="adm-btn-outline is-danger"
                    onClick={() => setForm({ ...form, image: '' })}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {error && <small className="adm-error">{error}</small>}
          </div>
  
          <label className="adm-check">
            <input name="visible" type="checkbox" checked={form.visible} onChange={set} />
            Show on site
          </label>
        </div>

        <div className="adm-modal-actions">
          <button type="button" className="adm-btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="adm-btn-primary">
            {product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  );
}