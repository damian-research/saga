import type { Tag } from "../models/bookmarks.types";

export const tagsService = {
  async getAll(): Promise<Tag[]> {
    return window.electronAPI.tags.getAll();
  },

  async getById(id: string): Promise<Tag | null> {
    return window.electronAPI.tags.getById(id);
  },

  async create(tag: Tag): Promise<Tag> {
    return window.electronAPI.tags.create(tag);
  },

  async update(id: string, label: string): Promise<Tag | null> {
    return window.electronAPI.tags.update(id, label);
  },

  async delete(id: string): Promise<void> {
    await window.electronAPI.tags.delete(id);
  },

  async getByBookmark(bookmarkId: string): Promise<Tag[]> {
    return window.electronAPI.tags.getByBookmark(bookmarkId);
  },

  // Legacy compatibility
  async load(): Promise<Tag[]> {
    return this.getAll();
  },

  async save(tags: Tag[]): Promise<void> {
    for (const tag of tags) {
      const existing = await this.getById(tag.id);
      if (existing) {
        await this.update(tag.id, tag.label);
      } else {
        await this.create(tag);
      }
    }
  },
};
