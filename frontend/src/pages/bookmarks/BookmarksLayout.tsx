// BookmarksLayout
//
import { useContext, useMemo, useState } from "react";
import styles from "./BookmarksLayout.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { BookmarkContext } from "../../context/BookmarkContext";
import CategoryTabs from "./CategoryTabs";

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

  const {
    categories,
    addCategory,
    renameCategory,
    removeCategory,
    updateBookmarkCategory,
  } = ctx;

  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleDropOnCategory(categoryId: string) {
    if (!dragBookmarkId) return;

    updateBookmarkCategory(dragBookmarkId, categoryId);
    setActiveCategoryId(categoryId);
    setDragBookmarkId(null);
  }

  // DRAG STATE
  const [dragCategoryId, setDragCategoryId] = useState<string | null>(null);
  const [dragBookmarkId, setDragBookmarkId] = useState<string | null>(null);

  // FILTER
  const visible = useMemo(() => {
    return bookmarks.filter((b) => b.categoryId === activeCategoryId);
  }, [bookmarks, activeCategoryId]);

  return (
    <div className={styles.container}>
      {/* ===== HEADER ===== */}
      <div className={styles.panel}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.panelTitle}>Bookmarks</div>

            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => ctx.openBookmarkWindow({ mode: "add-manual" })}
              >
                Add bookmark
              </button>

              <button
                className={styles.actionButton}
                disabled={!selectedId}
                onClick={() => selectedId && onRemove(selectedId)}
              >
                Remove bookmark
              </button>

              <button
                className={styles.actionButton}
                onClick={() => onExport(visible)}
              >
                Export
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.actionButton}
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
                  className={styles.actionButton}
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
                  className={`${styles.actionButton} ${styles.actionButtonDanger}`}
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
        </div>
      </div>

      {/* ===== CATEGORY TABS (DROP TARGETS) ===== */}
      <CategoryTabs
        categories={categories}
        bookmarks={bookmarks}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
        onDropBookmark={handleDropOnCategory}
      />

      {/* ===== BOOKMARK LIST (DRAG SOURCE) ===== */}
      <div className={`${styles.panel} ${styles.listPanel}`}>
        {loading && <div>Loading…</div>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Level</th>
              <th>Type</th>
              <th>Archive</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((b) => (
              <tr
                key={b.id}
                draggable
                onDragStart={() => setDragBookmarkId(b.id)}
                onClick={() => setSelectedId(b.id)}
                onDoubleClick={() => onOpen(b)}
                className={b.id === selectedId ? styles.selected : ""}
              >
                <td>{b.customName}</td>
                <td>{b.title}</td>
                <td>{b.ead3.level}</td>
                <td>{b.ead3.localType ?? "—"}</td>
                <td>{b.archive}</td>
                <td>{b.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
