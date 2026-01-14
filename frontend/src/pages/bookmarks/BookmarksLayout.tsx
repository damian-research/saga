// BookmarksLayout.tsx
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

type SortField = "name" | "title" | "level" | "archive" | "added";
type SortDirection = "asc" | "desc";

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

  // ===== FILTERS =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterArchive, setFilterArchive] = useState<string>("all");
  const [filterOnline, setFilterOnline] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");

  // ===== SORT =====
  const [sortField, setSortField] = useState<SortField>("added");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { tags } = tagCtx;

  const tagMap = useMemo(
    () => new Map(tags.map((t) => [t.name, t.label])),
    [tags]
  );

  const [dragBookmarkId, setDragBookmarkId] = useState<string | null>(null);

  // ===== FILTERED & SORTED DATA =====
  const visible = useMemo(() => {
    let result = bookmarks.filter((b) => b.categoryId === activeCategoryId);

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.customName.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q)
      );
    }

    // Filter by level
    if (filterLevel !== "all") {
      result = result.filter((b) => b.ead3.level === filterLevel);
    }

    // Filter by type
    if (filterType !== "all") {
      result = result.filter((b) => b.ead3.localType === filterType);
    }

    // Filter by archive
    if (filterArchive !== "all") {
      result = result.filter((b) => b.archive === filterArchive);
    }

    // Filter by online
    if (filterOnline === "yes") {
      result = result.filter((b) => b.ead3.digitalObjectCount > 0);
    } else if (filterOnline === "no") {
      result = result.filter((b) => b.ead3.digitalObjectCount === 0);
    }

    // Filter by tag
    if (filterTag !== "all") {
      result = result.filter((b) => b.tags?.includes(filterTag));
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "name":
          aVal = a.customName.toLowerCase();
          bVal = b.customName.toLowerCase();
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "level":
          aVal = a.ead3.level;
          bVal = b.ead3.level;
          break;
        case "archive":
          aVal = a.archive;
          bVal = b.archive;
          break;
        case "added":
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    bookmarks,
    activeCategoryId,
    searchQuery,
    filterArchive,
    filterOnline,
    filterTag,
    sortField,
    sortDirection,
  ]);

  function handleDropOnCategory(categoryId: string) {
    if (!dragBookmarkId) return;

    updateBookmarkCategory(dragBookmarkId, categoryId);
    setActiveCategoryId(categoryId);
    setDragBookmarkId(null);
  }

  function handleRemoveClick() {
    if (!selectedId) return;

    const bookmark = bookmarks.find((b) => b.id === selectedId);
    if (!bookmark) return;

    const confirmMessage = `Remove bookmark "${
      bookmark.customName || bookmark.title
    }"?`;

    if (!confirm(confirmMessage)) return;

    onRemove(selectedId);
    setSelectedId(null);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  // Get unique values from bookmarks
  const levels = useMemo(() => {
    return Array.from(new Set(bookmarks.map((b) => b.ead3?.level)));
  }, [bookmarks]);

  const types = useMemo(() => {
    return Array.from(new Set(bookmarks.map((b) => b.ead3?.localType)));
  }, [bookmarks]);

  const archives = useMemo(() => {
    return Array.from(new Set(bookmarks.map((b) => b.archive)));
  }, [bookmarks]);

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
                onClick={handleRemoveClick}
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

      {/* ===== FILTERS ===== */}
      <div className={styles.panel}>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="all">All levels</option>
            {levels.map((arch) => (
              <option key={arch} value={arch}>
                {arch}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All types</option>
            {types.map((arch) => (
              <option key={arch} value={arch}>
                {arch}
              </option>
            ))}
          </select>
          <select
            value={filterArchive}
            onChange={(e) => setFilterArchive(e.target.value)}
          >
            <option value="all">All archives</option>
            {archives.map((arch) => (
              <option key={arch} value={arch}>
                {arch}
              </option>
            ))}
          </select>

          <select
            value={filterOnline}
            onChange={(e) => setFilterOnline(e.target.value)}
          >
            <option value="all">Online: All</option>
            <option value="yes">Online: Yes</option>
            <option value="no">Online: No</option>
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="all">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== BOOKMARK LIST ===== */}
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
                <th
                  className={styles.sortable}
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className={styles.sortable}
                  onClick={() => handleSort("title")}
                >
                  Title{" "}
                  {sortField === "title" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className={styles.sortable}
                  onClick={() => handleSort("level")}
                >
                  Level{" "}
                  {sortField === "level" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Type</th>
                <th
                  className={styles.sortable}
                  onClick={() => handleSort("archive")}
                >
                  Archive{" "}
                  {sortField === "archive" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th>Tags</th>
                <th>Online</th>
                <th
                  className={styles.sortable}
                  onClick={() => handleSort("added")}
                >
                  Added{" "}
                  {sortField === "added" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
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

        {visible.length === 0 && !loading && (
          <div className={styles.emptyState}>No bookmarks found</div>
        )}
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
