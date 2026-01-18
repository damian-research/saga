import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
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
  },
  migration: {
    fromLocalStorage: (data: any) =>
      ipcRenderer.invoke("migrate:fromLocalStorage", data),
  },
  downloads: {
    downloadFile: (payload: { url: string; filename: string }) =>
      ipcRenderer.invoke("downloads:downloadFile", payload),
  },

});
