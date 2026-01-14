// BookmarksLayout
//
import { useContext, useMemo, useState } from "react";
import styles from "./BookmarksLayout.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { BookmarkContext, TagContext } from "../../context/BookmarkContext";
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

  // CATEGORIES
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

  // TAGS
  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { tags } = tagCtx;

  const tagMap = useMemo(
    () => new Map(tags.map((t) => [t.name, t.label])),
    [tags]
  );

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
                onClick={() => {
                  const b = bookmarks.find((x) => x.id === selectedId);
                  if (!b) return;

                  ctx.openBookmarkWindow({
                    mode: "edit",
                    bookmark: b,
                  });
                }}
              >
                Change
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
          <colgroup>
            <col className={styles["col-name"]} />
            <col className={styles["col-title"]} />
            <col className={styles["col-level"]} />
            <col className={styles["col-type"]} />
            <col className={styles["col-archive"]} />
            <col className={styles["col-tags"]} />
            <col className={styles["col-online"]} />
            <col className={styles["col-added"]} />
          </colgroup>

          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th>Level</th>
              <th>Type</th>
              <th>Archive</th>
              <th>Tags</th>
              <th>Online</th>
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
                <td className={styles.ellipsis}>{b.customName}</td>
                <td className={styles.ellipsis}>{b.title}</td>
                <td>{b.ead3.level}</td>
                <td>{b.ead3.localType ?? "—"}</td>
                <td>{b.archive}</td>

                {/* TAGS */}
                <td className={styles.tagsCell}>
                  {b.tags?.length ? (
                    <div className={styles.tagList}>
                      {b.tags.map((t) => (
                        <span key={t} className={styles.tag}>
                          {tagMap.get(t) ?? t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                {/* ONLINE */}
                <td className={styles.centerCell}>
                  {b.ead3.digitalObjectCount > 0 ? "✓" : "—"}
                </td>

                <td>{b.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
