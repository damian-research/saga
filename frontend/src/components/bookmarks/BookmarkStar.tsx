// BookmarkStar
import { useContext } from "react";
import type { Ead3Response } from "../search";
import { BookmarkContext } from "../../context/BookmarkContext";
import styles from "./BookmarkStar.module.css";
import { Bookmark } from "../../components/icons";

interface Props {
  record: Ead3Response;
  isSaved?: boolean;
}

export default function BookmarkStar({ record, isSaved = false }: Props) {
  const ctx = useContext(BookmarkContext);
  if (!ctx) return null;

  return (
    <button
      className={isSaved ? styles.starSaved : styles.star}
      title={isSaved ? "Saved" : "Save to Bookmarks"}
      onClick={(e) => {
        e.stopPropagation();
        ctx.openBookmarkWindow({
          mode: "add-from-search",
          record,
        });
      }}
    >
      {isSaved ? <Bookmark size={20} /> : <Bookmark size={18} />}
    </button>
  );
}
