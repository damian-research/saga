// BookmarksTabs
//
// BookmarkTabs.tsx
import type {
  Bookmark,
  BookmarkCategory,
} from "../../api/models/bookmarks.types";
import styles from "./BookmarkTabs.module.css";

interface Props {
  categories: BookmarkCategory[];
  bookmarks: Bookmark[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
}

export default function BookmarkTabs({
  categories,
  bookmarks,
  activeCategoryId,
  onSelect,
}: Props) {
  return (
    <div className={styles.tabs}>
      {categories
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((c) => {
          const count = bookmarks.filter((b) => b.categoryId === c.id).length;

          const isActive = c.id === activeCategoryId;

          return (
            <button
              key={c.id}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(c.id)}
              title={`${count} bookmarks`}
            >
              <span className={styles.name}>{c.name}</span>
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
    </div>
  );
}
