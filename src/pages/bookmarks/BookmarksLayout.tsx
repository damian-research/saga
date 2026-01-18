// BookmarksLayout.tsx
import {
  Plus,
  Share,
  FolderTree,
  Tags,
  XCircle,
  X,
} from "../../components/icons";
import { useContext, useMemo, useState } from "react";
import styles from "./BookmarksLayout.module.css";
import { getLevelLabel, type Bookmark } from "../../api/models";
import { BookmarkContext, TagContext } from "../../context/BookmarkContext";
import { useSearch } from "../../context/SearchContext";
import { SearchDetails } from "../../components/search";
import { Loader } from "../../components/loaders/Loader";
import {
  BookmarksTable,
  TagManager,
  CategoryManager,
  CategoryTabs,
} from "../../components/bookmarks";
import { ConfirmPopover } from "../../components/popover/confirmPopover";

interface Props {
  bookmarks: Bookmark[];
  loading: boolean;
  onRemove: (id: string) => void;
  onExport: (list: Bookmark[]) => void;
}

type SortField =
  | "name"
  | "title"
  | "level"
  | "archive"
  | "added"
  | "online"
  | "type";
type SortDirection = "asc" | "desc";

export default function BookmarksLayout({
  bookmarks,
  loading,
  onRemove,
  onExport,
}: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("BookmarkContext missing");
  const { categories, updateBookmarkCategory } = ctx;

  const [exportConfirmOpen, setExportConfirmOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState("__all__");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsHeader, setDetailsHeader] = useState<{
    name: string;
    category: string;
  } | null>(null);

  // ===== VIEW =====
  const {
    selectByPathSegment,
    selectedRecord,
    loading: searchLoading,
  } = useSearch();

  async function handleView(b: Bookmark) {
    const segmentId = b.eadId;

    if (!segmentId) return;

    const cat = categories.find((c) => c.id === b.categoryId);
    setDetailsHeader({
      name: b.customName || b.title,
      category: cat ? cat.name : "Uncategorized",
    });

    await selectByPathSegment(segmentId);
    setDetailsOpen(true);
  }

  // ===== FILTERS =====
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterArchive, setFilterArchive] = useState<string>("all");
  const [filterOnline, setFilterOnline] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ===== SORT =====
  const [sortField, setSortField] = useState<SortField>("added");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { tags } = tagCtx;

  // Build tagMap from tag names to labels
  const tagMap = useMemo(() => {
    const map = new Map<string, string>();
    tags.forEach((t) => {
      map.set(t.name, t.label);
    });
    return map;
  }, [tags]);

  const [dragBookmarkId, setDragBookmarkId] = useState<string | null>(null);

  // ===== FILTERED & SORTED DATA =====
  const visible = useMemo(() => {
    let result =
      activeCategoryId === "__all__"
        ? bookmarks
        : bookmarks.filter((b) => b.categoryId === activeCategoryId);

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.customName.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q),
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

    // Filter by tags (match ALL selected tags)
    if (selectedTags.length > 0) {
      result = result.filter((b) =>
        selectedTags.every((tag) => b.tags?.includes(tag)),
      );
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
        case "online":
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        case "type":
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
    filterLevel,
    filterType,
    filterArchive,
    filterOnline,
    selectedTags,
    sortField,
    sortDirection,
  ]);

  function handleDropOnCategory(categoryId: string) {
    if (!dragBookmarkId) return;
    if (categoryId === "__all__") return; // Can't drop on "All"

    updateBookmarkCategory(dragBookmarkId, categoryId);
    setActiveCategoryId(categoryId);
    setDragBookmarkId(null);
  }

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  }

  function clearTags() {
    setSelectedTags([]);
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  // Get unique archives from bookmarks
  const levels = useMemo(() => {
    return Array.from(
      new Set(bookmarks.map((b) => b.ead3?.level).filter(Boolean)),
    );
  }, [bookmarks]);

  const types = useMemo(() => {
    return Array.from(
      new Set(bookmarks.map((b) => b.ead3?.localType).filter(Boolean)),
    );
  }, [bookmarks]);

  const archives = useMemo(() => {
    return Array.from(new Set(bookmarks.map((b) => b.archive)));
  }, [bookmarks]);

  return (
    <div className={styles.container}>
      {searchLoading && <Loader fullscreen />}
      {/* ===== HEADER ===== */}
      <div className={styles.panel}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            {/* LEFT */}
            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
                onClick={() => ctx.openBookmarkWindow({ mode: "add-manual" })}
                title="Add bookmark"
              >
                <Plus size={26} strokeWidth={2} />
              </button>

              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* CENTER - FILTERS */}
          <div className={styles.headerCenter}>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">All levels</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {getLevelLabel(level)}
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
          </div>
          {/* RIGHT */}
          <div className={styles.headerRight}>
            <div className={styles.actions}>
              <button
                className={styles.actionButton}
                onClick={() => setShowTagManager(true)}
                title="Tag Manager"
              >
                <Tags size={18} />
              </button>

              <button
                className={styles.actionButton}
                onClick={() => setShowCategoryManager(true)}
                title="Category Manager"
              >
                <FolderTree size={18} />
              </button>

              <div className={styles.confirmAnchor}>
                <button
                  className={styles.actionButton}
                  onClick={() => setExportConfirmOpen(true)}
                  title="Export all bookmarks to JSON"
                >
                  <Share size={18} />
                </button>

                <ConfirmPopover
                  open={exportConfirmOpen}
                  text={`Export ${visible.length} bookmarks to a file?`}
                  onConfirm={() => onExport(visible)}
                  onCancel={() => setExportConfirmOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAG MULTI-SELECT */}
      <div className={styles.panel}>
        <div className={styles.tagFilter}>
          <button
            className={`${styles.clearTagsButton} ${styles.actionButtonDanger}`}
            onClick={clearTags}
            title="Clear selected tags"
          >
            <XCircle size={14} strokeWidth={2} />
          </button>
          <div className={styles.tagSeparator} />
          <div className={styles.tagOptions}>
            {tags.map((tag) => (
              <label key={tag.id} className={styles.tagCheckbox}>
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.name)}
                  onChange={() => toggleTag(tag.name)}
                />
                <span>{tag.label}</span>
              </label>
            ))}
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
      <BookmarksTable
        items={visible}
        loading={loading}
        selectedId={selectedId}
        tagMap={tagMap}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onSelect={setSelectedId}
        onEdit={(b) => ctx.openBookmarkWindow({ mode: "edit", bookmark: b })}
        onRemove={(id) => {
          onRemove(id);
          setSelectedId(null);
        }}
        onView={handleView}
        onDragStart={setDragBookmarkId}
      />

      {/* ===== MODALS ===== */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}

      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}

      <div
        className={`${styles.detailsDrawer} ${
          detailsOpen ? styles.detailsDrawerOpen : ""
        }`}
      >
        <div className={styles.detailsHeader}>
          <div className={styles.detailsMeta}>
            {detailsHeader && (
              <>
                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>MyName:</span>
                  <span className={styles.detailsValue}>
                    {detailsHeader.name}
                  </span>
                </div>

                <div className={styles.detailsRow}>
                  <span className={styles.detailsLabel}>Category:</span>
                  <span className={styles.detailsValue}>
                    {detailsHeader.category}
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            className={styles.closeButton}
            title="Close details"
            onClick={() => {
              setDetailsOpen(false);
              setDetailsHeader(null);
            }}
          >
            <X size={20} />
          </button>
        </div>

        {detailsOpen && searchLoading && (
          <div className={styles.loading}>Loading…</div>
        )}

        {detailsOpen && !searchLoading && selectedRecord && (
          <SearchDetails setBusy={() => {}} showBookmarkAction={false} />
        )}
      </div>
    </div>
  );
}
