// electron/preload.ts
import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}

const electronAPI = {
  bookmarks: {
    getAll: () => ipcRenderer.invoke("bookmarks:getAll"),
    getById: (id: string) => ipcRenderer.invoke("bookmarks:getById", id),
    create: (bookmark: any) => ipcRenderer.invoke("bookmarks:create", bookmark),
    update: (id: string, updates: any) =>
      ipcRenderer.invoke("bookmarks:update", id, updates),
    delete: (id: string) => ipcRenderer.invoke("bookmarks:delete", id),
  },
  categories: {
    getAll: () => ipcRenderer.invoke("categories:getAll"),
    getById: (id: string) => ipcRenderer.invoke("categories:getById", id),
    create: (category: any) =>
      ipcRenderer.invoke("categories:create", category),
    update: (id: string, updates: any) =>
      ipcRenderer.invoke("categories:update", id, updates),
    delete: (id: string) => ipcRenderer.invoke("categories:delete", id),
    reorder: (categoryIds: string[]) =>
      ipcRenderer.invoke("categories:reorder", categoryIds),
  },
  tags: {
    getAll: () => ipcRenderer.invoke("tags:getAll"),
    getById: (id: string) => ipcRenderer.invoke("tags:getById", id),
    create: (tag: any) => ipcRenderer.invoke("tags:create", tag),
    update: (id: string, label: string) =>
      ipcRenderer.invoke("tags:update", id, label),
    delete: (id: string) => ipcRenderer.invoke("tags:delete", id),
    getByBookmark: (bookmarkId: string) =>
      ipcRenderer.invoke("tags:getByBookmark", bookmarkId),
  },
  settings: {
    get: () => ipcRenderer.invoke("settings:get"),
    save: (settings: any) => ipcRenderer.invoke("settings:save", settings),
    pickDirectory: () => ipcRenderer.invoke("settings:pickDirectory"),
  },
  migration: {
    fromLocalStorage: (data: any) =>
      ipcRenderer.invoke("migrate:fromLocalStorage", data),
  },
  downloads: {
    start: (payload: { url: string; filename: string; directory?: string }) =>
      ipcRenderer.invoke("downloads:start", payload),
    cancel: () => ipcRenderer.send("downloads:cancel"),
    onProgress: (cb: (received: number, total: number) => void) => {
      const handler = (_: any, data: { received: number; total: number }) =>
        cb(data.received, data.total);
      ipcRenderer.on("downloads:progress", handler);
      return () => ipcRenderer.removeListener("downloads:progress", handler);
    },
  },
  nara: {
    search: (queryString: string) =>
      ipcRenderer.invoke("nara:search", queryString),
    getFull: (naId: number) => ipcRenderer.invoke("nara:getFull", naId),
    getChildren: (parentId: number, limit?: number) =>
      ipcRenderer.invoke("nara:getChildren", parentId, limit),
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
