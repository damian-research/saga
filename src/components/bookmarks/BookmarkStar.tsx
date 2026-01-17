// BookmarkStar
import { useContext, useMemo } from "react";
import type { Ead3Response } from "../search";
import { BookmarkContext } from "../../context/BookmarkContext";
import styles from "./BookmarkStar.module.css";
import { Bookmark } from "../icons";

interface Props {
  record: Ead3Response;
}

export default function BookmarkStar({ record }: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) return null;

  const { bookmarks, updateBookmarks } = ctx;

  // Check if this record is bookmarked
  const recordId = record.archDesc?.did?.unitId?.text;
  const savedBookmark = useMemo(() => {
    if (!recordId) return null;
    return bookmarks.find((b) => b.eadId === recordId) || null;
  }, [bookmarks, recordId]);

  const isSaved = !!savedBookmark;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();

    if (isSaved && savedBookmark) {
      // Remove bookmark with confirmation
      if (
        window.confirm(
          `Remove "${
            savedBookmark.customName || savedBookmark.title
          }" from bookmarks?`,
        )
      ) {
        updateBookmarks((prev) =>
          prev.filter((b) => b.id !== savedBookmark.id),
        );
      }
    } else {
      // Add bookmark
      ctx?.openBookmarkWindow({
        mode: "add-from-search",
        record,
      });
    }
  }

  return (
    <button
      className={`${styles.star} ${isSaved ? styles.starSaved : ""}`}
      title={isSaved ? "Remove from Bookmarks" : "Save to Bookmarks"}
      onClick={handleClick}
    >
      <Bookmark
        size={20}
        strokeWidth={2}
        fill={isSaved ? "currentColor" : "none"}
      />
    </button>
  );
}
