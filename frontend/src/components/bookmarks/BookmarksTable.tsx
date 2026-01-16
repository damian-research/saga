// BookmarksTable.tsx
import {
  Eye,
  Pencil,
  Trash2,
  Cloud,
  CloudOff,
  ChevronDown,
  ChevronUp,
  X,
} from "../../components/icons";
import { useState, useRef } from "react";
import styles from "./BookmarksTable.module.css";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { getLevelLabel } from "../../api/models/archive.types";
import { ConfirmPopover } from "../../components/popover/confirmPopover";

interface Props {
  items: Bookmark[];
  loading: boolean;
  selectedId: string | null;
  tagMap: Map<string, string>;
  sortField:
    | "name"
    | "title"
    | "level"
    | "archive"
    | "added"
    | "online"
    | "type";
  sortDirection: "asc" | "desc";
  onSort: (
    field: "name" | "title" | "level" | "archive" | "added" | "online" | "type"
  ) => void;
  onSelect: (id: string | null) => void;
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
  sortField,
  sortDirection,
  onSort,
  onSelect,
  onOpen,
  onEdit,
  onRemove,
  onView,
  onDragStart,
}: Props) {
  const hasItems = items.length > 0;
  const [removeId, setRemoveId] = useState<string | null>(null);

  function renderSortIcon(field: string) {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  }

  return (
    <div
      className={`${styles.panel} ${styles.listPanel}`}
      onClick={() => onSelect(null as any)}
    >
      {loading && <div>Loading…</div>}

      <div className={styles.tableWrapper}>
        <table className={styles.table} onClick={(e) => e.stopPropagation()}>
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
              <th onClick={() => onSort("name")} className={styles.sortable}>
                <span className={styles.thContent}>
                  Name
                  {renderSortIcon("name")}
                </span>
              </th>
              <th className={styles.sortable} onClick={() => onSort("title")}>
                <span className={styles.thContent}>
                  Title
                  {renderSortIcon("title")}
                </span>
              </th>
              <th className={styles.sortable} onClick={() => onSort("level")}>
                <span className={styles.thContent}>
                  Level
                  {renderSortIcon("level")}
                </span>
              </th>
              <th className={styles.sortable} onClick={() => onSort("type")}>
                <span className={styles.thContent}>
                  Type
                  {renderSortIcon("type")}
                </span>
              </th>
              <th className={styles.sortable} onClick={() => onSort("archive")}>
                <span className={styles.thContent}>
                  Archive
                  {renderSortIcon("archive")}
                </span>
              </th>
              <th>Tags</th>
              <th className={styles.sortable} onClick={() => onSort("online")}>
                <span className={styles.thContent}>
                  Online
                  {renderSortIcon("online")}
                </span>
              </th>
              <th className={styles.sortable} onClick={() => onSort("added")}>
                <span className={styles.thContent}>
                  Added
                  {renderSortIcon("added")}
                </span>
              </th>
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

                    <div className={styles.rowActions}>
                      {removeId === b.id ? (
                        /* ===== REMOVE CONFIRM MODE ===== */
                        <>
                          <button
                            className={`${styles.rowActionButton} ${styles.rowActionButtonDanger}`}
                            title="Confirm remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove(b.id);
                              setRemoveId(null);
                            }}
                          >
                            <Trash2 size={14} />
                          </button>

                          <button
                            className={styles.rowActionButton}
                            title="Cancel"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveId(null);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        /* ===== DEFAULT MODE ===== */
                        <>
                          <button
                            className={styles.rowActionButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(b);
                            }}
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            className={styles.rowActionButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(b);
                            }}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            className={`${styles.rowActionButton} ${styles.rowActionButtonDanger}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemoveId(b.id);
                            }}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
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
                  {b.ead3?.digitalObjectCount &&
                  b.ead3.digitalObjectCount > 0 ? (
                    <Cloud
                      size={18}
                      strokeWidth={2}
                      className={styles.onlineIcon}
                    />
                  ) : (
                    <CloudOff size={18} />
                  )}
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
