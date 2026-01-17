import { ipcMain } from "electron";
import { TagsService } from "../../../backend/services/tags.service";
import { IPC_CHANNELS } from "../channels";
import { Tag } from "../../../src/api/models/bookmarks.types";

export function registerTagsHandlers(service: TagsService) {
  ipcMain.handle(IPC_CHANNELS.TAGS_GET_ALL, () => {
    return service.getAll();
  });

  ipcMain.handle(IPC_CHANNELS.TAGS_GET_BY_ID, (_event, id: string) => {
    return service.getById(id);
  });

  ipcMain.handle(IPC_CHANNELS.TAGS_CREATE, (_event, tag: Tag) => {
    return service.create(tag);
  });

  ipcMain.handle(
    IPC_CHANNELS.TAGS_UPDATE,
    (_event, id: string, label: string) => {
      service.update(id, label);
      return service.getById(id);
    },
  );

  ipcMain.handle(IPC_CHANNELS.TAGS_DELETE, (_event, id: string) => {
    service.delete(id);
  });

  ipcMain.handle(
    IPC_CHANNELS.TAGS_GET_BY_BOOKMARK,
    (_event, bookmarkId: string) => {
      return service.getByBookmark(bookmarkId);
    },
  );
}
