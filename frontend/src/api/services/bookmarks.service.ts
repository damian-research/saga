import type { Bookmark } from "../models/bookmarks.types";

// Temporary local JSON persistence layer (dev-only)

const STORAGE_KEY = "saga.bookmarks.json";

/**
 * Load bookmarks from mocked JSON storage.
 * Currently backed by localStorage to simulate file-based JSON.
 */
export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[bookmarks] failed to load, returning empty set", err);
    return [];
  }
}

/**
 * Save (add or update) a single bookmark.
 * This is a write-only persistence side-effect.
 */
export function saveBookmark(bookmark: Bookmark): void {
  const current = loadBookmarks();

  const exists = current.some((b) => b.id === bookmark.id);
  const next = exists
    ? current.map((b) => (b.id === bookmark.id ? bookmark : b))
    : [...current, bookmark];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
  } catch (err) {
    console.error("[bookmarks] failed to save", err);
  }
}

/**
 * Remove bookmark by id and persist.
 */
export function removeBookmark(id: string): void {
  const current = loadBookmarks();
  const next = current.filter((b) => b.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
  } catch (err) {
    console.error("[bookmarks] failed to save", err);
  }
}
