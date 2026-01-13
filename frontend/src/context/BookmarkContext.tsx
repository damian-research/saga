// BookmarkContext
//
import { createContext } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type { Bookmark, WindowMode } from "../api/models/bookmarks.types";

export interface OpenAddBookmarkPayload {
  mode: WindowMode;
  record?: Ead3Response;
  bookmark?: Bookmark;
}

export interface BookmarkActions {
  openBookmarkWindow(payload: OpenAddBookmarkPayload): void;
}

export const BookmarkContext = createContext<BookmarkActions | null>(null);
