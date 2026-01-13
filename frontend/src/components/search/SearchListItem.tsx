// SearchListItem
//
import type { Ead3Response } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";
import BookmarkStar from "../bookmarks/BookmarkStar";
import { useSearch } from "../../context/SearchContext";

interface SearchListItemProps {
  record: Ead3Response;
  isSelected: boolean;
}

export default function SearchListItem({
  record,
  isSelected,
}: SearchListItemProps) {
  const { selectRecord, selectByPathSegment } = useSearch();
  const unitTitle = record.archDesc.did.unitTitle;
  const unitId = record.archDesc.did.unitId?.text || "";
  const levelRaw = record.archDesc.level || "";

  let level = "";
  if (levelRaw === "item") level = "Item";
  else if (levelRaw === "fileUnit") level = "File Unit";
  else if (levelRaw === "series") level = "Series";
  else if (levelRaw === "recordgrp") level = "Record Group";

  let materialType = "";
  let mediaType = "";
  //if (!firstDao) {
  materialType = Array.isArray(record.archDesc.localType)
    ? record.archDesc.localType.join(" / ")
    : record.archDesc.localType || "";
  mediaType = record.archDesc.dsc?.head || "";
  //}

  return (
    <div className={`${styles.item} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.path}>
        <PathShell path={record.path} onSelect={selectByPathSegment} />
      </div>

      <div className={styles.titleRow}>
        <div className={styles.detailsTitle}>{unitTitle}</div>

        <div className={styles.actions}>
          <BookmarkStar record={record} />
          <button
            type="button"
            className={styles.arrow}
            title="Open details"
            onClick={(e) => {
              e.stopPropagation();
              selectRecord(record);
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        | ID: {unitId} | {level} | [ {materialType} -&gt; {mediaType} ]
      </div>

      <div className={styles.digitalObjects}>
        Online objects: {record.digitalObjectCount}
      </div>
    </div>
  );
}
