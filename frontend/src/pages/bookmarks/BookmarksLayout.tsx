// BookmarksLayout
//
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
  if (!ctx) {
    throw new Error("BookmarkContext missing");
  }

  const { categories, addCategory, renameCategory, removeCategory } = ctx;

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return bookmarks.filter((b) => b.categoryId === activeCategoryId);
  }, [bookmarks, activeCategoryId]);

  return (
    <div className={styles.container}>
      {/* ===== HEADER / ACTIONS ===== */}
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

      {/* ===== CATEGORY TABS ===== */}
      <div className={styles.tabs}>
        {categories
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((c) => {
            const count = bookmarks.filter((b) => b.categoryId === c.id).length;

            return (
              <button
                key={c.id}
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

      {/* ===== CATEGORY MANAGEMENT ===== */}
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

      {/* ===== BOOKMARK LIST ===== */}
      <div className={`${styles.panel} ${styles.listPanel}`}>
        {loading && <div className={styles.loader}>Loading…</div>}

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
