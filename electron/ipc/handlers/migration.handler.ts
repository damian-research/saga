import { ipcMain } from "electron";
import { BookmarksService } from "../../../backend/services/bookmarks.service";
import { CategoriesService } from "../../../backend/services/categories.service";
import { TagsService } from "../../../backend/services/tags.service";
import { IPC_CHANNELS } from "../channels";

interface MigrationData {
  categories: any[];
  tags: any[];
  bookmarks: any[];
}

export function registerMigrationHandlers(
  bookmarksService: BookmarksService,
  categoriesService: CategoriesService,
  tagsService: TagsService,
) {
  ipcMain.handle(
    IPC_CHANNELS.MIGRATE_DATA,
    async (_event, data: MigrationData) => {
      console.log("[Migration] Received data from renderer");

      // Migrate categories
      for (const cat of data.categories) {
        try {
          categoriesService.create(cat);
        } catch (err) {
          // Already exists
        }
      }

      // Migrate tags
      for (const tag of data.tags) {
        try {
          tagsService.create(tag);
        } catch (err) {
          // Already exists
        }
      }

      // Migrate bookmarks
      for (const bookmark of data.bookmarks) {
        try {
          bookmarksService.create(bookmark);
        } catch (err) {
          // Already exists
        }
      }

      console.log("[Migration] Complete");
      return { success: true };
    },
  );
}
