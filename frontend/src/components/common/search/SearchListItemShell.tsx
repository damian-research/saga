import React from "react";
import BookmarkStar from "../bookmarks/BookmarkStar";
import type { Bookmark } from "../../../api/models/bookmarks.types";

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
    <div className={`list-item ${isSelected ? "active" : ""}`}>
      <div className="list-item-content">{children}</div>

      <div className="list-item-actions">
        <BookmarkStar
          bookmark={bookmark}
          isSaved={isSaved}
          className="bookmark-star"
        />

        <div className="list-item-click" onClick={onClick}>
          <span className="list-item-arrow">›</span>
        </div>
      </div>
    </div>
  );
}
