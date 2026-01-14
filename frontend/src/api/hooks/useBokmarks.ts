// hooks/useBookmarks.ts
import { useEffect, useState } from "react";
import type { Bookmark } from "../../api/models/bookmarks.types";
import {
  loadBookmarks,
  saveBookmark,
  removeBookmark,
} from "../../api/services/bookmarks.service";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loaded = loadBookmarks();
    setBookmarks(loaded);
    setLoading(false);
  }, []);

  function saveOne(bookmark: Bookmark) {
    setBookmarks((prev) => {
      const next = prev.some((b) => b.id === bookmark.id)
        ? prev.map((b) => (b.id === bookmark.id ? bookmark : b))
        : [...prev, bookmark];

      saveBookmark(bookmark);
      return next;
    });
  }

  function remove(id: string) {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    removeBookmark(id);
  }

  function updateMany(updater: (prev: Bookmark[]) => Bookmark[]) {
    setBookmarks((prev) => {
      const next = updater(prev);
      // Zapisz wszystkie na raz
      next.forEach(saveBookmark);
      return next;
    });
  }

  function updateCategory(id: string, categoryId: string) {
    setBookmarks((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, categoryId } : b));
      const updated = next.find((b) => b.id === id);
      if (updated) saveBookmark(updated);
      return next;
    });
  }

  return {
    bookmarks,
    loading,
    saveOne,
    remove,
    updateMany,
    updateCategory,
  };
}
