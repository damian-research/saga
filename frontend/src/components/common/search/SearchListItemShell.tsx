import React from "react";
import BookmarkStar from "../bookmarks/BookmarkStar";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "./SearchListItemShell.module.css";

interface Props {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  bookmark: Bookmark;
  isSaved?: boolean;
}

export default function SearchListItemShell({
  isSelected,
  onClick,
  children,
  bookmark,
  isSaved,
}: Props) {
  return (
    <div className={`${styles.item} ${isSelected ? styles.active : ""}`}>
      <div className={styles.content}>{children}</div>

      <div className={styles.actions}>
        <div className={styles.star}>
          <BookmarkStar bookmark={bookmark} isSaved={isSaved} />
        </div>

        <div className={styles.clickZone} onClick={onClick}>
          <span className={styles.arrow}>›</span>
        </div>
      </div>
    </div>
  );
}
