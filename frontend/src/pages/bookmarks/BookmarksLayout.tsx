// BookmarksLayout
//
// BookmarksLayout.tsx
import { useContext, useMemo, useState } from "react";
import styles from "./BookmarksLayout.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { BookmarkContext } from "../../context/BookmarkContext";

interface Props {
  bookmarks: Bookmark[];
  loading: boolean;
  onOpen: (b: Bookmark) => void;
  onRemove: (id: string) => void;
  onExport: (list: Bookmark[]) => void;
}

export default function BookmarksLayout({
  bookmarks,
  loading,
  onOpen,
  onRemove,
  onExport,
}: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("BookmarkContext missing");

  const { categories, addCategory, renameCategory, removeCategory } = ctx;

  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // ===== FILTER =====
  const visible = useMemo(() => {
    return bookmarks.filter((b) => b.categoryId === activeCategoryId);
  }, [bookmarks, activeCategoryId]);

  // ===== DRAG HELPERS =====
  function reorderCategories(fromId: string, toId: string) {
    if (fromId === toId) return;

    const ordered = [...categories].sort((a, b) => a.order - b.order);

    const fromIdx = ordered.findIndex((c) => c.id === fromId);
    const toIdx = ordered.findIndex((c) => c.id === toId);

    if (fromIdx < 0 || toIdx < 0) return;

    const [moved] = ordered.splice(fromIdx, 1);
    ordered.splice(toIdx, 0, moved);

    // reassign order
    ordered.forEach((c, i) => {
      c.order = i;
    });

    // persist via context (renameCategory hack-free update)
    ordered.forEach((c) => renameCategory(c.id, c.name));
  }

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.panel}>
        <div className={styles.panelTitle}>Bookmarks</div>

        <div className={styles.actions}>
          <button
            onClick={() => ctx.openBookmarkWindow({ mode: "add-manual" })}
          >
            Add bookmark
          </button>

          <button
            disabled={!selectedId}
            onClick={() => selectedId && onRemove(selectedId)}
          >
            Remove bookmark
          </button>

          <button onClick={() => onExport(visible)}>Export</button>
        </div>
      </div>

      {/* ===== CATEGORY TABS (DRAGGABLE) ===== */}
      <div className={styles.tabs}>
        {[...categories]
          .sort((a, b) => a.order - b.order)
          .map((c) => {
            const count = bookmarks.filter((b) => b.categoryId === c.id).length;

            return (
              <button
                key={c.id}
                draggable
                onDragStart={() => setDraggingId(c.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingId) reorderCategories(draggingId, c.id);
                  setDraggingId(null);
                }}
                className={
                  c.id === activeCategoryId ? styles.activeTab : styles.tab
                }
                onClick={() => setActiveCategoryId(c.id)}
              >
                {c.name} ({count})
              </button>
            );
          })}
      </div>

      {/* ===== CATEGORY ACTIONS ===== */}
      <div className={styles.categoryActions}>
        <button
          onClick={() => {
            const name = prompt("New category name");
            if (name) addCategory(name.trim());
          }}
        >
          + Category
        </button>

        {activeCategoryId !== "uncategorized" && (
          <>
            <button
              onClick={() => {
                const current = categories.find(
                  (c) => c.id === activeCategoryId
                );
                if (!current) return;

                const name = prompt("Rename category", current.name);
                if (name) renameCategory(activeCategoryId, name.trim());
              }}
            >
              Rename
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    "Remove category? Bookmarks will be moved to Uncategorized."
                  )
                ) {
                  removeCategory(activeCategoryId);
                  setActiveCategoryId("uncategorized");
                }
              }}
            >
              Remove
            </button>
          </>
        )}
      </div>

      {/* ===== LIST ===== */}
      <div className={`${styles.panel} ${styles.listPanel}`}>
        {loading && <div>Loading…</div>}

        <table className={styles.table}>
          <tbody>
            {visible.map((b) => (
              <tr
                key={b.id}
                className={b.id === selectedId ? styles.selected : ""}
                onClick={() => setSelectedId(b.id)}
                onDoubleClick={() => onOpen(b)}
              >
                <td>{b.customName}</td>
                <td>{b.title}</td>
                <td>{b.archive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
