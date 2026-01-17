import { ipcMain } from "electron";
import { CategoriesService } from "../../../backend/services/categories.service";
import { IPC_CHANNELS } from "../channels";
import { BookmarkCategory } from "../../../src/api/models/bookmarks.types";

export function registerCategoriesHandlers(service: CategoriesService) {
  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET_ALL, () => {
    return service.getAll();
  });

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_GET_BY_ID, (_event, id: string) => {
    return service.getById(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_CREATE,
    (_event, category: BookmarkCategory) => {
      return service.create(category);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_UPDATE,
    (_event, id: string, updates: Partial<BookmarkCategory>) => {
      service.update(id, updates);
      return service.getById(id);
    },
  );

  ipcMain.handle(IPC_CHANNELS.CATEGORIES_DELETE, (_event, id: string) => {
    service.delete(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.CATEGORIES_REORDER,
    (_event, categoryIds: string[]) => {
      service.reorder(categoryIds);
    },
  );
}
