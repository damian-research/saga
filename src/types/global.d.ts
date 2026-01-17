declare const __APP_VERSION__: string;

import { Bookmark, BookmarkCategory, Tag } from "../api/models/bookmarks.types";
import { AppSettings } from "../api/services/settings.service";

declare global {
  interface Window {
    electronAPI: {
      bookmarks: {
        getAll: () => Promise<Bookmark[]>;
        getById: (id: string) => Promise<Bookmark | null>;
        create: (bookmark: Bookmark) => Promise<Bookmark>;
        update: (
          id: string,
          updates: Partial<Bookmark>,
        ) => Promise<Bookmark | null>;
        delete: (id: string) => Promise<void>;
      };
      categories: {
        getAll: () => Promise<BookmarkCategory[]>;
        getById: (id: string) => Promise<BookmarkCategory | null>;
        create: (category: BookmarkCategory) => Promise<BookmarkCategory>;
        update: (
          id: string,
          updates: Partial<BookmarkCategory>,
        ) => Promise<BookmarkCategory | null>;
        delete: (id: string) => Promise<void>;
        reorder: (categoryIds: string[]) => Promise<void>;
      };
      tags: {
        getAll: () => Promise<Tag[]>;
        getById: (id: string) => Promise<Tag | null>;
        create: (tag: Tag) => Promise<Tag>;
        update: (id: string, label: string) => Promise<Tag | null>;
        delete: (id: string) => Promise<void>;
        getByBookmark: (bookmarkId: string) => Promise<Tag[]>;
      };
      settings: {
        get: () => Promise<AppSettings>;
        save: (settings: AppSettings) => Promise<void>;
      };
      migration: {
        fromLocalStorage: (data: {
          categories: any[];
          tags: any[];
          bookmarks: any[];
        }) => Promise<{ success: boolean }>;
      };
    };
  }
}

export {};
