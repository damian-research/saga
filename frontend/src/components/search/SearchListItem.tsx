// SearchListItem
//
import type { Ead3Response } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";
import BookmarkStar from "../bookmarks/BookmarkStar";
// import type { Bookmark } from "../../api/models/bookmarks.types";
// import { TEMP_CATEGORIES } from "../../api/models/bookmarks.types";
// import { mapEad3ToBookmark } from "../../api/utils/ead3.mapper";

interface SearchListItemProps {
  record: Ead3Response;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function SearchListItem({
  record,
  onSelect,
  isSelected,
}: SearchListItemProps) {
  const unitTitle = record.archDesc.did.unitTitle;
  const unitId = record.archDesc.did.unitId?.text || "";
  const levelRaw = record.archDesc.level || "";

  let level = "";
  if (levelRaw === "item") level = "Item";
  else if (levelRaw === "fileUnit") level = "File Unit";
  else if (levelRaw === "series") level = "Series";
  else if (levelRaw === "recordgrp") level = "Record Group";

  const firstDao =
    record.archDesc.dsc?.components?.[0]?.did.daoSet?.daos?.[0] || null;

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
        <PathShell path={record.path} onSelect={(id) => onSelect(String(id))} />
      </div>

      <div className={styles.titleRow}>
        <div className={styles.detailsTitle}>{unitTitle}</div>

        <div className={styles.actions}>
          <BookmarkStar record={record} />
          <button
            className={styles.arrow}
            title="Open details"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(unitId);
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.meta}>
        | ID: {unitId} | {level}
            {" "}
            | [ {materialType} -&gt; {mediaType} ]
      </div>

      <div className={styles.digitalObjects}>
        Online objects: {record.digitalObjectCount}
      </div>
    </div>
  );
}
