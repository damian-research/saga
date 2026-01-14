// BookmarkContext.ts
import { createContext } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type {
  Bookmark,
  BookmarkCategory,
  WindowMode,
  Tag,
} from "../api/models/bookmarks.types";

// BOOKMARKS
export interface OpenAddBookmarkPayload {
  mode: WindowMode;
  record?: Ead3Response;
  bookmark?: Bookmark;
}

export interface BookmarkActions {
  openBookmarkWindow(payload: OpenAddBookmarkPayload): void;
  categories: BookmarkCategory[];
  addCategory(name: string): void;
  renameCategory(id: string, name: string): void;
  removeCategory(id: string): void;
  updateBookmarkCategory(id: string, categoryId: string): void;
}

export const BookmarkContext = createContext<BookmarkActions | null>(null);

// TAGS
export interface TagActions {
  tags: Tag[];

  ensureTags(names: string[]): void;
  renameTag(tagId: string, newLabel: string): void;
  removeTag(tagId: string): void;
}

export const TagContext = createContext<TagActions | null>(null);
