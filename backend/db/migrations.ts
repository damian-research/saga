import { Database } from "better-sqlite3";
import { BookmarksService } from "../services/bookmarks.service";
import { CategoriesService } from "../services/categories.service";
import { TagsService } from "../services/tags.service";

const MIGRATION_FLAG_KEY = "saga.migrated_to_sqlite";

export async function migrateFromLocalStorage(
  _db: Database,
  bookmarksService: BookmarksService,
  categoriesService: CategoriesService,
  tagsService: TagsService,
): Promise<void> {
  // Check if already migrated
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === "true") {
    return;
  }

  console.log("[Migration] Starting localStorage → SQLite migration...");

  try {
    // Migrate categories
    const categoriesRaw = localStorage.getItem("saga.categories.json");
    if (categoriesRaw) {
      const categories = JSON.parse(categoriesRaw);
      for (const cat of categories) {
        try {
          categoriesService.create(cat);
        } catch (err) {
          console.warn("[Migration] Category exists:", cat.id);
        }
      }
      console.log(`[Migration] Migrated ${categories.length} categories`);
    }

    // Migrate tags
    const tagsRaw = localStorage.getItem("saga.tags.json");
    if (tagsRaw) {
      const tags = JSON.parse(tagsRaw);
      for (const tag of tags) {
        try {
          tagsService.create(tag);
        } catch (err) {
          console.warn("[Migration] Tag exists:", tag.id);
        }
      }
      console.log(`[Migration] Migrated ${tags.length} tags`);
    }

    // Migrate bookmarks
    const bookmarksRaw = localStorage.getItem("saga.bookmarks.json");
    if (bookmarksRaw) {
      const bookmarks = JSON.parse(bookmarksRaw);
      for (const bookmark of bookmarks) {
        try {
          bookmarksService.create(bookmark);
        } catch (err) {
          console.warn("[Migration] Bookmark exists:", bookmark.id);
        }
      }
      console.log(`[Migration] Migrated ${bookmarks.length} bookmarks`);
    }

    // Mark as migrated
    localStorage.setItem(MIGRATION_FLAG_KEY, "true");
    console.log("[Migration] Complete. Data now in SQLite.");
  } catch (err) {
    console.error("[Migration] Failed:", err);
    throw err;
  }
}
