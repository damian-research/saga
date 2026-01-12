import { createContext } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type { Bookmark } from "../api/models/bookmarks.types";

export interface OpenAddBookmarkPayload {
  mode: "add-from-search" | "add-manual";
  record?: Ead3Response;
  bookmark?: Bookmark;
}

export interface BookmarkActions {
  openAddBookmark(payload: OpenAddBookmarkPayload): void;
}

export const BookmarkContext = createContext<BookmarkActions | null>(null);
