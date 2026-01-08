import { useState } from "react";
import { BookmarksLayout } from ".";
import { BookmarkModal } from ".";
import type { Bookmark } from "../../api/models/bookmarks.types";

export default function BookmarksTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | null>(null);

  function openBookmark(b: Bookmark) {
    console.log("Open bookmark", b);
  }

  function removeBookmark(id: string) {
    if (!confirm("Remove selected bookmark?")) return;
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }

  function submitBookmark(data: { category: string; customName?: string }) {
    if (mode === "edit" && editing) {
      setBookmarks((prev) =>
        prev.map((b) => (b.id === editing.id ? { ...b, ...data } : b))
      );
    }
    setEditing(null);
    setMode(null);
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
  const categories = Array.from(
    new Set(bookmarks.map((b) => b.category))
  ).sort();

  return (
    <>
      <BookmarksLayout
        bookmarks={bookmarks}
        onOpen={openBookmark}
        onAdd={() => setMode("add")}
        onEdit={(b) => {
          setEditing(b);
          setMode("edit");
        }}
        onRemove={(id) => removeBookmark(id)}
        onExport={(list) => exportBookmarks(list)}
      />

      {mode && (
        <BookmarkModal
          mode={mode}
          bookmark={editing}
          categories={categories}
          onCancel={() => {
            setEditing(null);
            setMode(null);
          }}
          onSubmit={submitBookmark}
        />
      )}
    </>
  );
}
