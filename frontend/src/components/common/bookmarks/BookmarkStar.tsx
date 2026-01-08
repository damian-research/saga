import { useContext } from "react";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import { BookmarkContext } from "../../../context/BookmarkContext";

interface Props {
  bookmark: Bookmark;
  isSaved?: boolean;
  className?: string;
}

export default function BookmarkStar({
  bookmark,
  isSaved = false,
  className,
}: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) return null;

  return (
    <button
      className={className}
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
