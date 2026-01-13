// BookmarksLayout
//
import { useMemo, useState, useEffect } from "react";
import type { Bookmark } from "../../api/models/bookmarks.types";
import styles from "./BookmarksLayout.module.css";

interface Props {
  bookmarks: Bookmark[];
  onOpen: (b: Bookmark) => void;
  onAdd: () => void;
  onEdit: (b: Bookmark) => void;
  onRemove: (id: string) => void;
  onExport: (list: Bookmark[]) => void;
  loading: boolean;
}

interface BookmarkCategory {
  id: string;
  name: string;
  order: number;
}

export default function BookmarksLayout({
  bookmarks,
  onOpen,
  onAdd,
  onEdit,
  onRemove,
  onExport,
  loading,
}: Props) {
  const [categories, setCategories] = useState<BookmarkCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? null;

  useEffect(() => {
    const uniq = Array.from(new Set(bookmarks.map((b) => b.category)));
    setCategories(
      uniq.map((name, i) => ({
        id: crypto.randomUUID(),
        name,
        order: i,
      }))
    );
  }, [bookmarks]);

  useEffect(() => {
    if (!activeCategoryId && categories.length) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const [filters, setFilters] = useState({
    level: "",
    archive: "",
    name: "",
    recordType: "",
  });

  const filteredBookmarks = useMemo(() => {
    if (!activeCategory) return [];

    return bookmarks
      .filter((b) => b.category === activeCategory.name)
      .filter((b) => {
        if (filters.level && b.ead3.level !== filters.level) return false;
        if (filters.archive && b.archive !== filters.archive) return false;
        if (
          filters.name &&
          !(
            b.customName.toLowerCase().includes(filters.name.toLowerCase()) ||
            b.title.toLowerCase().includes(filters.name.toLowerCase())
          )
        )
          return false;
        if (
          filters.recordType &&
          !b.ead3.localType
            ?.toLowerCase()
            .includes(filters.recordType.toLowerCase())
        )
          return false;
        return true;
      });
  }, [bookmarks, activeCategory, filters]);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <div className={styles.panelTitle}>Saved Records</div>

        <div className={styles.actions}>
          <button onClick={onAdd} disabled={loading}>
            Add
          </button>
          <button
            disabled={loading || !selectedId}
            onClick={() => {
              const b = bookmarks.find((x) => x.id === selectedId);
              if (b) onEdit(b);
            }}
          >
            Change
          </button>
          <button
            disabled={loading || !selectedId}
            onClick={() => selectedId && onRemove(selectedId)}
          >
            Remove
          </button>
          <button onClick={() => onExport(filteredBookmarks)}>Export</button>
        </div>

        <div className={styles.filters}>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">Level</option>
            {[...new Set(bookmarks.map((b) => b.ead3.level))].map((l) => (
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
            {[...new Set(bookmarks.map((b) => b.archive))].map((a) => (
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
            {[...new Set(bookmarks.map((b) => b.ead3.localType))].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tabs}>
        {categories
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((c) => {
            const count = bookmarks.filter((b) => b.category === c.name).length;
            return (
              <button
                key={c.id}
                className={c.id === activeCategoryId ? styles.activeTab : ""}
                onClick={() => setActiveCategoryId(c.id)}
              >
                {c.name} ({count})
              </button>
            );
          })}
      </div>

      <div className={`${styles.panel} ${styles.listPanel}`}>
        {loading && <div className={styles.loader}>Loading…</div>}
        <table className={styles.table}>
          <tbody>
            {filteredBookmarks.map((b) => (
              <tr
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                onDoubleClick={() => onOpen(b)}
                className={b.id === selectedId ? styles.selected : ""}
              >
                <td>{b.customName}</td>
                <td>{b.title}</td>
                <td>{b.ead3.level}</td>
                <td>{b.ead3.localType}</td>
                <td>{b.archive}</td>
                <td>{b.ead3.digitalObjectCount > 0 ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
