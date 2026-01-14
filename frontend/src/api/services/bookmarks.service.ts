import type { Bookmark, Tag } from "../models/bookmarks.types";

const BOOKMARKS_KEY = "saga.bookmarks.json";
const TAGS_KEY = "saga.tags.json";

/**
 * Load bookmarks from mocked JSON storage.
 * Currently backed by localStorage to simulate file-based JSON.
 */
export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
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
// bookmarks.service.ts
export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks, null, 2));
  } catch (err) {
    console.error("[bookmarks] failed to save batch", err);
  }
}

export function saveBookmark(bookmark: Bookmark): void {
  const current = loadBookmarks();

  const exists = current.some((b) => b.id === bookmark.id);
  const next = exists
    ? current.map((b) => (b.id === bookmark.id ? bookmark : b))
    : [...current, bookmark];

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next, null, 2));
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
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next, null, 2));
  } catch (err) {
    console.error("[bookmarks] failed to save", err);
  }
}

/**
 * Load and Save Tags.
 */
export function loadTags(): Tag[] {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTags(tags: Tag[]) {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags, null, 2));
}
