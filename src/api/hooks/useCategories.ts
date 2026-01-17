import { useEffect, useState } from "react";
import type { BookmarkCategory } from "../../api/models/bookmarks.types";

const DEFAULT_CATEGORY: BookmarkCategory = {
  id: "uncategorized",
  name: "Uncategorized",
  order: 0,
  createdAt: new Date().toISOString(),
};

export function useCategories(onCategoryRemoved: (id: string) => void) {
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.electronAPI.categories
      .getAll()
      .then((loaded) => {
        if (loaded.length === 0) {
          return window.electronAPI.categories
            .create(DEFAULT_CATEGORY)
            .then((created) => [created]);
        }
        return loaded;
      })
      .then(setCategories)
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setCategories([DEFAULT_CATEGORY]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function add(name: string) {
    try {
      const newCategory: BookmarkCategory = {
        id: crypto.randomUUID(),
        name,
        order: categories.length,
        createdAt: new Date().toISOString(),
      };

      const created = await window.electronAPI.categories.create(newCategory);
      setCategories((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  }

  async function rename(id: string, name: string) {
    try {
      const updated = await window.electronAPI.categories.update(id, { name });
      if (updated) {
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } catch (err) {
      console.error("Failed to rename category:", err);
    }
  }

  async function remove(id: string) {
    if (id === DEFAULT_CATEGORY.id) return;

    try {
      await window.electronAPI.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      onCategoryRemoved(id);
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  }

  return {
    categories,
    loading,
    addCategory: add,
    renameCategory: rename,
    removeCategory: remove,
  };
}

export { DEFAULT_CATEGORY };
