import { BookmarksLayout } from ".";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksTab.module.css";

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
}

export default function BookmarksTab({ bookmarks, setBookmarks }: Props) {
  function openBookmark(b: Bookmark) {
    //console.log("Open bookmark", b);
  }

  function removeBookmark(id: string) {
    if (!confirm("Remove selected bookmark?")) return;
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
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
        onEdit={(b) => {
          // Editing handled outside now
        }}
        onRemove={(id) => removeBookmark(id)}
        onExport={(list) => exportBookmarks(list)}
      />
    </div>
  );
}
