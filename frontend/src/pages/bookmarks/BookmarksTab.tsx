import { useState } from "react";
import { BookmarksLayout } from ".";
import type {
  Bookmark,
  WindowMode,
  Category,
  ArchiveName,
} from "../../api/models/bookmarks.types";
import AddBookmark from "../../components/bookmarks/AddBookmark";
import styles from "./BookmarksTab.module.css";
import { getRecord } from "../../api/services/searchRecords.service";
import { buildBookmark } from "../../api/utils/buildBookmarks";

interface Props {
  bookmarks: Bookmark[];
  setBookmarks: React.Dispatch<React.SetStateAction<Bookmark[]>>;
  onEditBookmark: (b: Bookmark) => void;
}

export default function BookmarksTab({
  bookmarks,
  setBookmarks,
  onEditBookmark,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [mode, setMode] = useState<WindowMode>("add-manual");
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

  async function handleAdd(data: {
    category: Category;
    customName: string;
    url?: string;
    archive?: ArchiveName;
  }) {
    if (!data.url) return;

    const match = data.url.match(/\/id\/(\d+)/);
    if (!match) {
      alert("Invalid NARA link");
      return;
    }

    const record = await getRecord(Number(match[1]));
    const bookmark = buildBookmark(record);
    bookmark.mode = "add-manual";
    bookmark.category = data.category;
    bookmark.customName = data.customName;

    setBookmarks((prev) => [...prev, bookmark]);
  }

  function handleEdit(
    bookmark: Bookmark,
    data: {
      category: Category;
      customName: string;
    }
  ) {
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === bookmark.id
          ? {
              ...b,
              category: data.category,
              customName: data.customName,
            }
          : b
      )
    );
  }

  function openBookmark(b: Bookmark) {
    // TODO: getRecord(b.eadId) -> Details
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
        onEdit={(b) => onEditBookmark(b)}
        onRemove={(id) => removeBookmark(id)}
        onExport={(list) => exportBookmarks(list)}
        onAdd={() => {
          setMode("add-manual");
          setActiveBookmark(null);
          setAdding(true);
        }}
      />

      {adding && (
        <AddBookmark
          mode={mode}
          bookmark={activeBookmark}
          onCancel={() => setAdding(false)}
          onSubmit={(data) => {
            if (mode === "add-manual") {
              handleAdd(data);
            } else if (activeBookmark) {
              handleEdit(activeBookmark, data);
            }
            setAdding(false);
          }}
        />
      )}
    </div>
  );
}
