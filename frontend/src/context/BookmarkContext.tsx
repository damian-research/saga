// BookmarkContext.ts
import { createContext } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type {
  Bookmark,
  BookmarkCategory,
  WindowMode,
} from "../api/models/bookmarks.types";

export interface OpenAddBookmarkPayload {
  mode: WindowMode;
  record?: Ead3Response;
  bookmark?: Bookmark;
}

export interface BookmarkActions {
  // bookmark modal
  openBookmarkWindow(payload: OpenAddBookmarkPayload): void;

  // categories
  categories: BookmarkCategory[];
  addCategory(name: string): void;
  renameCategory(id: string, name: string): void;
  removeCategory(id: string): void;
  updateBookmarkCategory(id: string, categoryId: string): void;
}

export const BookmarkContext = createContext<BookmarkActions | null>(null);
