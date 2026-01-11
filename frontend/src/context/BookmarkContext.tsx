import { createContext } from "react";
import type { Bookmark, WindowMode } from "../api/models/bookmarks.types";

export interface BookmarkActions {
  openAddBookmark: (bookmark: Bookmark, mode: WindowMode) => void;
}

export const BookmarkContext = createContext<BookmarkActions | null>(null);
