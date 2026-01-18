// // categories.service.ts
// import type { BookmarkCategory } from "../models/bookmarks.types";

// const STORAGE_KEY = "saga.categories.json";

// export function loadCategories(): BookmarkCategory[] {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     if (!raw) return [];
//     const parsed = JSON.parse(raw);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// }

// export function saveCategories(categories: BookmarkCategory[]): void {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(categories, null, 2));
// }
