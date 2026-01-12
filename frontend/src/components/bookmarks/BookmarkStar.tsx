import { useContext } from "react";
import type { Ead3Response } from "../search";
import { BookmarkContext } from "../../context/BookmarkContext";
import styles from "./BookmarkStar.module.css";

interface Props {
  record: Ead3Response;
  isSaved?: boolean;
}

export default function BookmarkStar({ record, isSaved = false }: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) return null;

  return (
    <button
      className={styles.star}
      title={isSaved ? "Saved" : "Save to Bookmarks"}
      onClick={(e) => {
        e.stopPropagation();
        ctx.openAddBookmark({
          mode: "add-from-search",
          record,
        });
      }}
    >
      {isSaved ? "★" : "☆"}
    </button>
  );
}
