// BookmarksTab - REFACTORED
//
import { useEffect, useState } from "react";
import { BookmarksLayout } from ".";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksTab.module.css";
import { loadBookmarks } from "../../api/services/bookmarks.service";

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  onEditBookmark: (b: Bookmark) => void;
  onAddBookmark: () => void;
  onRemoveBookmark: (id: string) => void;
}

export default function BookmarksTab({
  bookmarks,
  setBookmarks,
  onEditBookmark,
  onAddBookmark,
  onRemoveBookmark,
}: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load only
    (async () => {
      setLoading(true);
      const list = loadBookmarks();
      setBookmarks(list);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openBookmark(b: Bookmark) {
    // TODO: getRecord(b.eadId) -> Details
    console.log("Open bookmark:", b);
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
      <BookmarksLayout
        bookmarks={bookmarks}
        onOpen={openBookmark}
        onEdit={onEditBookmark}
        onRemove={onRemoveBookmark}
        onExport={exportBookmarks}
        onAdd={onAddBookmark}
        loading={loading}
      />
    </div>
  );
}
