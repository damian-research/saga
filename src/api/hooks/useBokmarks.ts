import { useEffect, useState } from "react";
import type { Bookmark } from "../../api/models/bookmarks.types";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.electronAPI.bookmarks
      .getAll()
      .then(setBookmarks)
      .catch((err) => console.error("Failed to load bookmarks:", err))
      .finally(() => setLoading(false));
  }, []);

  async function saveOne(bookmark: Bookmark) {
    try {
      const existing = await window.electronAPI.bookmarks.getById(bookmark.id);
      const saved = existing
        ? await window.electronAPI.bookmarks.update(bookmark.id, bookmark)
        : await window.electronAPI.bookmarks.create(bookmark);

      if (saved) {
        setBookmarks((prev) => {
          const exists = prev.some((b) => b.id === bookmark.id);
          return exists
            ? prev.map((b) => (b.id === bookmark.id ? saved : b))
            : [...prev, saved];
        });
      }
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    }
  }

  async function remove(id: string) {
    try {
      await window.electronAPI.bookmarks.delete(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
    }
  }

  async function updateMany(updater: (prev: Bookmark[]) => Bookmark[]) {
    const next = updater(bookmarks);

    for (const bookmark of next) {
      try {
        await window.electronAPI.bookmarks.update(bookmark.id, bookmark);
      } catch (err) {
        console.error("Failed to update bookmark:", bookmark.id, err);
      }
    }

    setBookmarks(next);
  }

  async function updateCategory(id: string, categoryId: string) {
    try {
      const updated = await window.electronAPI.bookmarks.update(id, {
        categoryId,
      });
      if (updated) {
        setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
    } catch (err) {
      console.error("Failed to update bookmark category:", err);
    }
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
