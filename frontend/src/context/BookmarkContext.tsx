import { createContext } from "react";
import type { Bookmark } from "../api/models/bookmarks.types";

export interface BookmarkActions {
  openAddBookmark: (bookmark: Bookmark) => void;
}

export const BookmarkContext =
  createContext<BookmarkActions | null>(null);