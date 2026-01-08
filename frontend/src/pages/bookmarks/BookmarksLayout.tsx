import { useMemo, useState } from "react";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksLayout.module.css";

interface Props {
  bookmarks: Bookmark[];
  onOpen: (b: Bookmark) => void;
  onEdit: (b: Bookmark) => void;
  onRemove: (id: string) => void;
  onExport: (list: Bookmark[]) => void;
}

export default function BookmarksLayout({
  bookmarks,
  onOpen,
  onEdit,
  onRemove,
  onExport,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    category: "",
    level: "",
    archive: "",
    name: "",
    recordType: "",
  });

  const grouped = bookmarks.reduce<Record<string, Bookmark[]>>((acc, b) => {
    acc[b.category] ??= [];
    acc[b.category].push(b);
    return acc;
  }, {});

  const orderedBookmarks = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([_, items]) =>
      items
        .slice()
        .sort((a, b) =>
          (a.customName ?? a.originalTitle).localeCompare(
            b.customName ?? b.originalTitle
          )
        )
    );

  const filteredBookmarks = useMemo(() => {
    return orderedBookmarks.filter((b) => {
      if (filters.category && b.category !== filters.category) return false;
      if (filters.level && b.level !== filters.level) return false;
      if (filters.archive && b.archiveName !== filters.archive) return false;
      if (
        filters.name &&
        !(
          b.customName?.toLowerCase().includes(filters.name.toLowerCase()) ||
          b.originalTitle.toLowerCase().includes(filters.name.toLowerCase())
        )
      )
        return false;
      if (
        filters.recordType &&
        !b.recordType.toLowerCase().includes(filters.recordType.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orderedBookmarks, filters]);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>Saved Records</div>

        <div className={styles.actions}>
          <button
            disabled={!selectedId}
            onClick={() => {
              const b = bookmarks.find((x) => x.id === selectedId);
              if (b) onEdit(b);
            }}
          >
            Change
          </button>

          <button
            disabled={!selectedId}
            onClick={() => selectedId && onRemove(selectedId)}
          >
            Remove
          </button>
          <button onClick={() => onExport(filteredBookmarks)}>Export</button>
        </div>

        <div className={styles.filters}>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">Category</option>
            {[...new Set(bookmarks.map((b) => b.category))].sort().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">Level</option>
            {[...new Set(bookmarks.map((b) => b.level))].sort().map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            value={filters.archive}
            onChange={(e) =>
              setFilters({ ...filters, archive: e.target.value })
            }
          >
            <option value="">Archive</option>
            {[...new Set(bookmarks.map((b) => b.archiveName))]
              .sort()
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </select>

          <input
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />

          <select
            value={filters.recordType}
            onChange={(e) =>
              setFilters({ ...filters, recordType: e.target.value })
            }
          >
            <option value="">Record type</option>
            {[...new Set(bookmarks.map((b) => b.recordType))]
              .sort()
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className={`${styles.panel} ${styles.listPanel}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Custom name</th>
              <th>Original title</th>
              <th>Level</th>
              <th>Record type</th>
              <th>Archive</th>
              <th>Online</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookmarks.map((b) => (
              <tr
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                onDoubleClick={() => onOpen(b)}
                className={b.id === selectedId ? styles.selected : ""}
              >
                <td>{b.category}</td>
                <td>{b.customName ?? "—"}</td>
                <td>{b.originalTitle}</td>
                <td>{b.level}</td>
                <td>{b.recordType}</td>
                <td>{b.archiveName}</td>
                <td>{b.onlineAvailable ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
