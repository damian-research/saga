// BookmarksTab
//
import { useEffect, useState, useContext } from "react";
import BookmarksLayout from "./BookmarksLayout";
import { BookmarkProvider } from "../../context/BookmarkProvider";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksTab.module.css";
import { loadBookmarks } from "../../api/services/bookmarks.service";
import { BookmarkContext } from "../../context/BookmarkContext";

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  onRemoveBookmark: (id: string) => void;
}

export default function BookmarksTab({
  bookmarks,
  setBookmarks,
  onRemoveBookmark,
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const list = await loadBookmarks();
      setBookmarks(list);
      setLoading(false);
    })();
  }, [setBookmarks]);

  const bookmarkActions = useContext(BookmarkContext);
  if (!bookmarkActions) throw new Error("BookmarkContext missing");

  function openBookmark(b: Bookmark) {
    console.log("Open bookmark:", b);
  }

  function saveBookmark(bookmark: Bookmark) {
    setBookmarks((prev) => {
      const idx = prev.findIndex((b) => b.id === bookmark.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = bookmark;
        return copy;
      }
      return [...prev, bookmark];
    });
  }

  function exportBookmarks(list: Bookmark[]) {
    const blob = new Blob([JSON.stringify(list, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "saga-bookmarks.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.container}>
      <BookmarkProvider onSaveBookmark={saveBookmark}>
        <BookmarksLayout
          bookmarks={bookmarks}
          loading={loading}
          onOpen={openBookmark}
          onRemove={onRemoveBookmark}
          onExport={exportBookmarks}
          onAdd={() =>
            bookmarkActions.openBookmarkWindow({ mode: "add-manual" })
          }
          onEdit={(b) =>
            bookmarkActions.openBookmarkWindow({ mode: "edit", bookmark: b })
          }
        />
      </BookmarkProvider>
    </div>
  );
}
