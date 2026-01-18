import { ipcMain } from "electron";
import { CategoriesService } from "../../../backend/services/categories.service";
import { IPC_CHANNELS } from "../channels";
import { BookmarkCategory } from "../../../src/api/models/bookmarks.types";

export function registerCategoriesHandlers(service: CategoriesService) {
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET_ALL, () => {
    try {
      return service.getAll();
    } catch (error) {
      console.error("[NARA] Category getall failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Category getall failed",
      );
    }
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET_BY_ID, (_event, id: string) => {
    try {
      return service.getById(id);
    } catch (error) {
      console.error("[NARA] Category getbyid failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Category getbyid failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_CREATE,
    (_event, category: BookmarkCategory) => {
      try {
        return service.create(category);
      } catch (error) {
        console.error("[NARA] Category create failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Category create failed",
        );
      }
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_UPDATE,
    (_event, id: string, updates: Partial<BookmarkCategory>) => {
      try {
        service.update(id, updates);
        return service.getById(id);
      } catch (error) {
        console.error("[NARA] Category update failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Category update failed",
        );
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_DELETE, (_event, id: string) => {
    try {
      service.delete(id);
    } catch (error) {
      console.error("[NARA] Category delete failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Category delete failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_REORDER,
    (_event, categoryIds: string[]) => {
      try {
        service.reorder(categoryIds);
      } catch (error) {
        console.error("[NARA] Category reorder failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Category reorder failed",
        );
      }
    },
  );
}
