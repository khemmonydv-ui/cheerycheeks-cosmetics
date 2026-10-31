// categories.json is read-only, so the admin's changes are saved in localStorage on top of it:
//   edits    { [categoryId]: { name, description, image } }   changes to a JSON category
//   added    [ category, ... ]                                 categories made in admin
//   deleted  [ categoryId, ... ]                               JSON categories removed in admin

const KEY = 'cherrycheeks-category-changes';
export const CATEGORIES_CHANGED = 'cherrycheeks-categories-changed';
const NONE = { edits: {}, added: [], deleted: [] };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') return { ...NONE, ...saved };
  } catch {
    // saved data is broken, start without changes
  }
  return NONE;
}

function save(changes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(changes));
    window.dispatchEvent(new Event(CATEGORIES_CHANGED));
    return true;
  } catch {
    return false; // storage full: the picture is probably too large
  }
}

/** categories.json + the admin's changes */
export function applyCategoryChanges(jsonCategories) {
  const { edits, added, deleted } = load();
  return [...jsonCategories, ...added]
    .filter((category) => !deleted.includes(category.id))
    .map((category) => ({ ...category, ...(edits[category.id] || {}) }));
}

export const nextCategoryId = (categories) =>
  Math.max(0, ...categories.map((category) => Number(category.id) || 0)) + 1;

/** Save a new category (isNew) or the changes to an existing one. Returns true when saved. */
export function saveCategory(category, isNew) {
  const changes = load();
  const fields = {
    name: category.name,
    description: category.description,
    image: category.image,
  };

  if (isNew) {
    return save({ ...changes, added: [...changes.added, { id: category.id, ...fields }] });
  }

  if (changes.added.some((item) => item.id === category.id)) {
    return save({
      ...changes,
      added: changes.added.map((item) => (item.id === category.id ? { ...item, ...fields } : item)),
    });
  }

  return save({ ...changes, edits: { ...changes.edits, [category.id]: fields } });
}

export function deleteCategory(id) {
  const changes = load();
  if (changes.added.some((item) => item.id === id)) {
    return save({ ...changes, added: changes.added.filter((item) => item.id !== id) });
  }
  return save({ ...changes, deleted: [...changes.deleted, id] });
}