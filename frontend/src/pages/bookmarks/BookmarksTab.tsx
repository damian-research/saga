import { useState } from "react";
import BookmarksLayout from "./BookmarksLayout";
import type { Bookmark } from "../../api/models/bookmarks.types";

export default function BookmarksTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  function openBookmark(b: Bookmark) {
    // later: route to NARA / UK
    console.log("Open bookmark", b);
  }

  return <BookmarksLayout bookmarks={bookmarks} onOpen={openBookmark} />;
}
