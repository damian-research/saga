// SearchListItem
//
import { memo } from "react";
import type { Ead3Response } from "../../api/models/ead3.types";
import { useSearch } from "../../context/SearchContext";
import { parseListItem } from "../../api/utils/recordParser";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";
import { BookmarkStar } from "../bookmarks";

interface SearchListItemProps {
  record: Ead3Response;
  isSelected: boolean;
}

function SearchListItemComponent({ record, isSelected }: SearchListItemProps) {
  const { selectRecord, selectByPathSegment } = useSearch();
  const item = parseListItem(record);

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      onClick={() => selectRecord(record)}
    >
      <div className={styles.path}>
        <PathShell path={record.path} onSelect={selectByPathSegment} />
      </div>

      <div className={styles.titleRow}>
        <div className={styles.detailsTitle}>{item.title}</div>

        <div className={styles.actions}>
          <BookmarkStar record={record} />
        </div>
      </div>

      <div className={styles.meta}>
        | ID: {item.unitId} | {item.level} | [ {item.materialType} →{" "}
        {item.mediaType} ]
      </div>

      <div className={styles.digitalObjects}>
        Online objects: {item.digitalObjectCount}
      </div>
    </div>
  );
}

export default memo(SearchListItemComponent);
