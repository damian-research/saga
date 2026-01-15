// BookmarksTable.tsx
import styles from "./BookmarksTable.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { getLevelLabel } from "../../api/models/archive.types";

interface Props {
  items: Bookmark[];
  loading: boolean;
  selectedId: string | null;
  tagMap: Map<string, string>;
  onSelect: (id: string) => void;
  onOpen: (b: Bookmark) => void;
  onEdit: (b: Bookmark) => void;
  onRemove: (id: string) => void;
  onView: (b: Bookmark) => void;
  onDragStart: (id: string) => void;
}

export default function BookmarksTable({
  items,
  loading,
  selectedId,
  tagMap,
  onSelect,
  onOpen,
  onEdit,
  onRemove,
  onView,
  onDragStart,
}: Props) {
  const hasItems = items.length > 0;

  return (
    <div className={`${styles.panel} ${styles.listPanel}`}>
      {loading && <div>Loading…</div>}

      <div className={styles.tableWrapper}>
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
            {items.map((b) => (
              <tr
                key={b.id}
                draggable
                onDragStart={() => onDragStart(b.id)}
                onClick={() => onSelect(b.id)}
                onDoubleClick={() => onOpen(b)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onSelect(b.id);
                }}
                className={b.id === selectedId ? styles.selected : ""}
              >
                {/* NAME */}
                <td className={styles.ellipsis}>
                  <div className={styles.cellWithActions}>
                    <span>{b.customName}</span>

                    {b.id === selectedId && (
                      <div className={styles.rowActions}>
                        <button
                          className={styles.rowActionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(b);
                          }}
                          title="View details"
                        >
                          👁
                        </button>
                        <button
                          className={styles.rowActionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(b);
                          }}
                          title="Edit"
                        >
                          ✎
                        </button>

                        <button
                          className={`${styles.rowActionButton} ${styles.rowActionButtonDanger}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                `Remove bookmark "${b.customName || b.title}"?`
                              )
                            ) {
                              onRemove(b.id);
                            }
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </td>

                {/* TITLE */}
                <td className={styles.ellipsis}>{b.title}</td>

                {/* LEVEL */}
                <td>
                  {b.ead3?.level ? (
                    <span
                      className={`${styles.levelBadge} ${
                        styles[`level${b.ead3.level}`]
                      }`}
                    >
                      {getLevelLabel(b.ead3.level)}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                {/* TYPE */}
                <td>{b.ead3?.localType ?? "—"}</td>

                {/* ARCHIVE */}
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
                  {b.ead3?.digitalObjectCount && b.ead3.digitalObjectCount > 0
                    ? "✓"
                    : "—"}
                </td>

                {/* ADDED */}
                <td>{b.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hasItems && !loading && (
        <div className={styles.emptyState}>No bookmarks found</div>
      )}
    </div>
  );
}
