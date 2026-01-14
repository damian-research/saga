// BookmarksLayout
//
import { useContext, useMemo, useState } from "react";
import styles from "./BookmarksLayout.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { BookmarkContext, TagContext } from "../../context/BookmarkContext";
import CategoryTabs from "./CategoryTabs";
import TagManager from "../../components/bookmarks/TagManager";
import CategoryManager from "../../components/bookmarks/CategoryManager";

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

  const { categories, updateBookmarkCategory } = ctx;

  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? ""
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { tags } = tagCtx;

  const tagMap = useMemo(
    () => new Map(tags.map((t) => [t.name, t.label])),
    [tags]
  );

  const [dragBookmarkId, setDragBookmarkId] = useState<string | null>(null);

  const visible = useMemo(() => {
    return bookmarks.filter((b) => b.categoryId === activeCategoryId);
  }, [bookmarks, activeCategoryId]);

  function handleDropOnCategory(categoryId: string) {
    if (!dragBookmarkId) return;

    updateBookmarkCategory(dragBookmarkId, categoryId);
    setActiveCategoryId(categoryId);
    setDragBookmarkId(null);
  }

  // ===== HANDLE REMOVE WITH CONFIRMATION =====
  function handleRemoveClick() {
    if (!selectedId) return;

    const bookmark = bookmarks.find((b) => b.id === selectedId);
    if (!bookmark) return;

    const confirmMessage = `Remove bookmark "${
      bookmark.customName || bookmark.title
    }"?`;

    if (!confirm(confirmMessage)) return;

    onRemove(selectedId);
    setSelectedId(null); // ← clear selection after remove
  }

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
                disabled={!selectedId} // ← aktywny tylko gdy selected
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
                disabled={!selectedId} // ← aktywny tylko gdy selected
                onClick={handleRemoveClick} // ← z potwierdzeniem
              >
                Remove
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
              onClick={() => setShowTagManager(true)}
            >
              Manage tags
            </button>

            <button
              className={styles.actionButton}
              onClick={() => setShowCategoryManager(true)}
            >
              Manage categories
            </button>
          </div>
        </div>
      </div>

      {/* ===== CATEGORY TABS ===== */}
      <CategoryTabs
        categories={categories}
        bookmarks={bookmarks}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
        onDropBookmark={handleDropOnCategory}
      />

      {/* ===== BOOKMARK LIST ===== */}
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
                    <div
                      className={styles.tagList}
                      title={b.tags.map((t) => tagMap.get(t) ?? t).join(", ")}
                    >
                      {b.tags.slice(0, 3).map((t) => (
                        <span key={t} className={styles.tag}>
                          {tagMap.get(t) ?? t}
                        </span>
                      ))}
                      {b.tags.length > 3 && (
                        <span className={styles.tagMore}>
                          +{b.tags.length - 3}
                        </span>
                      )}
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

      {/* ===== MODALS ===== */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}

      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  );
}
