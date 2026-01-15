// hooks/useCategories.ts
import { useEffect, useState } from "react";
import type { BookmarkCategory } from "../../api/models/bookmarks.types";
import {
  loadCategories,
  saveCategories,
} from "../../api/services/categories.service";

const DEFAULT_CATEGORY: BookmarkCategory = {
  id: "uncategorized",
  name: "Uncategorized",
  order: 0,
  createdAt: new Date().toISOString(),
};

export function useCategories(onCategoryRemoved: (id: string) => void) {
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);

  useEffect(() => {
    const loaded = loadCategories();
    const normalized = loaded.map((c) => ({
      ...c,
      createdAt: c.createdAt ?? new Date().toISOString(),
    }));

    if (normalized.length === 0) {
      setCategories([DEFAULT_CATEGORY]);
      saveCategories([DEFAULT_CATEGORY]);
    } else {
      setCategories(normalized);
      saveCategories(normalized);
    }
  }, []);

  function add(name: string) {
    setCategories((prev) => {
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          order: prev.length,
          createdAt: new Date().toISOString(),
        },
      ];
      saveCategories(next);
      return next;
    });
  }

  function rename(id: string, name: string) {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name } : c));
      saveCategories(next);
      return next;
    });
  }

  function remove(id: string) {
    if (id === DEFAULT_CATEGORY.id) return;

    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCategories(next);
      return next;
    });

    onCategoryRemoved(id);
  }

  return {
    categories,
    addCategory: add,
    renameCategory: rename,
    removeCategory: remove,
  };
}

export { DEFAULT_CATEGORY };
