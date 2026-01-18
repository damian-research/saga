import { ipcMain } from "electron";
import { TagsService } from "../../../backend/services/tags.service";
import { IPC_CHANNELS } from "../channels";
import { Tag } from "../../../src/api/models/bookmarks.types";

export function registerTagsHandlers(service: TagsService) {
  ipcMain.handle(IPC_CHANNELS.TAGS_GET_ALL, () => {
    try {
      return service.getAll();
    } catch (error) {
      console.error("[NARA] Tag getall failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Bookmark getall failed",
      );
    }
  });

  ipcMain.handle(IPC_CHANNELS.TAGS_GET_BY_ID, (_event, id: string) => {
    try {
      return service.getById(id);
    } catch (error) {
      console.error("[NARA] Tag getbyid failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Tag getbyid failed",
      );
    }
  });

  ipcMain.handle(IPC_CHANNELS.TAGS_CREATE, (_event, tag: Tag) => {
    try {
      return service.create(tag);
    } catch (error) {
      console.error("[NARA] Tag create failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Tag create failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.TAGS_UPDATE,
    (_event, id: string, label: string) => {
      try {
        service.update(id, label);
        return service.getById(id);
      } catch (error) {
        console.error("[NARA] Tag update failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Tag update failed",
        );
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.TAGS_DELETE, (_event, id: string) => {
    try {
      service.delete(id);
    } catch (error) {
      console.error("[NARA] Tag delete failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "Tag delete failed",
      );
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.TAGS_GET_BY_BOOKMARK,
    (_event, bookmarkId: string) => {
      try {
        return service.getByBookmark(bookmarkId);
      } catch (error) {
        console.error("[NARA] Tag getbybookmarkid failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Tag getbybookmarkid failed",
        );
      }
    },
  );
}
