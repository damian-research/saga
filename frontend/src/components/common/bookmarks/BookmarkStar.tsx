import { useContext } from "react";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import { BookmarkContext } from "../../../context/BookmarkContext";
import styles from "./BookmarkStar.module.css";

interface Props {
  bookmark: Bookmark;
  isSaved?: boolean;
}

export default function BookmarkStar({ bookmark, isSaved = false }: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) return null;

  return (
    <button
      className={styles.star}
      title={isSaved ? "Saved" : "Save to Bookmarks"}
      onClick={(e) => {
        e.stopPropagation();
        ctx.openAddBookmark(bookmark);
      }}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}
