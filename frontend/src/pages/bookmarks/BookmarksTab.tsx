// BookmarksTab
//
import BookmarksLayout from "./BookmarksLayout";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksTab.module.css";
import { SearchProvider } from "../../context/SearchContext";

interface Props {
  bookmarks: Bookmark[];
  loading: boolean;
  onRemoveBookmark: (id: string) => void;
}

export default function BookmarksTab({
  bookmarks,
  loading,
  onRemoveBookmark,
}: Props) {
  function openBookmark(b: Bookmark) {
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
      <SearchProvider>
        <BookmarksLayout
          bookmarks={bookmarks}
          loading={loading}
          onOpen={openBookmark}
          onRemove={onRemoveBookmark}
          onExport={exportBookmarks}
        />
      </SearchProvider>
    </div>
  );
}
