import { ipcMain } from "electron";
import { BookmarksService } from "../../../backend/services/bookmarks.service";
import { IPC_CHANNELS } from "../channels";
import { Bookmark } from "../../../src/api/models/bookmarks.types";

export function registerBookmarksHandlers(service: BookmarksService) {
  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_GET_ALL, () => {
    try {
      return service.getAll();
    } catch (error) {
      console.error("[NARA] Bookmark getall failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Bookmark getall failed",
      );
    }
  });

  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_GET_BY_ID, (_event, id: string) => {
    try {
      return service.getById(id);
    } catch (error) {
      console.error("[NARA] Bookmark getbyid failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Bookmark getbyid failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.BOOKMARKS_CREATE,
    (_event, bookmark: Bookmark) => {
      try {
        return service.create(bookmark);
      } catch (error) {
        console.error("[NARA] Bookmark create failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Bookmark create failed",
        );
      }
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.BOOKMARKS_UPDATE,
    (_event, id: string, updates: Partial<Bookmark>) => {
      try {
        service.update(id, updates);
        return service.getById(id);
      } catch (error) {
        console.error("[NARA] Bookmark update failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Bookmark update failed",
        );
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_DELETE, (_event, id: string) => {
    try {
      service.delete(id);
    } catch (error) {
      console.error("[NARA] Search failed:", error);
      throw new Error(error instanceof Error ? error.message : "Search failed");
    }
  });
}
