// src/api/electron.api.ts

export const electronApi = {
  bookmarks: {
    getAll: () => window.electronAPI.bookmarks.getAll(),
    getById: (id: string) => window.electronAPI.bookmarks.getById(id),
    create: (bookmark: any) => window.electronAPI.bookmarks.create(bookmark),
    update: (id: string, updates: any) =>
      window.electronAPI.bookmarks.update(id, updates),
    delete: (id: string) => window.electronAPI.bookmarks.delete(id),
  },
  categories: {
    getAll: () => window.electronAPI.categories.getAll(),
    getById: (id: string) => window.electronAPI.categories.getById(id),
    create: (category: any) => window.electronAPI.categories.create(category),
    update: (id: string, updates: any) =>
      window.electronAPI.categories.update(id, updates),
    delete: (id: string) => window.electronAPI.categories.delete(id),
    reorder: (categoryIds: string[]) =>
      window.electronAPI.categories.reorder(categoryIds),
  },
  tags: {
    getAll: () => window.electronAPI.tags.getAll(),
    getById: (id: string) => window.electronAPI.tags.getById(id),
    create: (tag: any) => window.electronAPI.tags.create(tag),
    update: (id: string, label: string) =>
      window.electronAPI.tags.update(id, label),
    delete: (id: string) => window.electronAPI.tags.delete(id),
    getByBookmark: (bookmarkId: string) =>
      window.electronAPI.tags.getByBookmark(bookmarkId),
  },
  settings: {
    get: () => window.electronAPI.settings.get(),
    save: (settings: any) => window.electronAPI.settings.save(settings),
  },
  migration: {
    fromLocalStorage: (data: any) =>
      window.electronAPI.migration.fromLocalStorage(data),
  },
  downloads: {
    start: (payload: { url: string; filename: string }) =>
      window.electronAPI.downloads.start(payload),
    cancel: () => window.electronAPI.downloads.cancel(),
    onProgress: (cb: (received: number, total: number) => void) =>
      window.electronAPI.downloads.onProgress(cb),
  },
  nara: {
    search: (queryString: string) =>
      window.electronAPI.nara.search(queryString),
    getFull: (naId: number) => window.electronAPI.nara.getFull(naId),
    getChildren: (parentId: number, limit?: number) =>
      window.electronAPI.nara.getChildren(parentId, limit),
  },
};
