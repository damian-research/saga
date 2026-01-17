import { ipcMain } from "electron";
import { BookmarksService } from "../../../backend/services/bookmarks.service";
import { IPC_CHANNELS } from "../channels";
import { Bookmark } from "../../../src/api/models/bookmarks.types";

export function registerBookmarksHandlers(service: BookmarksService) {
  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_GET_ALL, () => {
    return service.getAll();
  });

  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_GET_BY_ID, (_event, id: string) => {
    return service.getById(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.BOOKMARKS_CREATE,
    (_event, bookmark: Bookmark) => {
      return service.create(bookmark);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.BOOKMARKS_UPDATE,
    (_event, id: string, updates: Partial<Bookmark>) => {
      service.update(id, updates);
      return service.getById(id);
    },
  );

  ipcMain.handle(IPC_CHANNELS.BOOKMARKS_DELETE, (_event, id: string) => {
    service.delete(id);
  });
}
