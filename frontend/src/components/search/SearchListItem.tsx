// SearchListItem - POPRAWIONY
//
import type { Ead3Response } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";
import BookmarkStar from "../bookmarks/BookmarkStar";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { TEMP_CATEGORIES } from "../../api/models/bookmarks.types";

interface SearchListItemProps {
  record: Ead3Response;
  onSelect: (id: string) => void;
  isSelected: boolean; // ← DODANE
}

export default function SearchListItem({
  record,
  onSelect,
  isSelected, // ← DODANE
}: SearchListItemProps) {
  const unitTitle = record.archDesc.did.unitTitle;
  const unitId = record.archDesc.did.unitId?.text || "";
  const levelRaw = record.archDesc.level || "";

  let level = "";
  if (levelRaw === "fileUnit") level = "Item";
  else if (levelRaw === "series") level = "Series";
  else if (levelRaw === "recordgrp") level = "Record Group";

  const firstDao =
    record.archDesc.dsc?.components?.[0]?.did.daoSet?.daos?.[0] || null;

  let materialType = "";
  let mediaType = "";
  if (!firstDao) {
    materialType = Array.isArray(record.archDesc.localType)
      ? record.archDesc.localType.join(" / ")
      : record.archDesc.localType || "";
    mediaType = record.archDesc.dsc?.head || "";
  }

  const bookmark: Bookmark = {
    mode: "add-from-search",
    id: `ead3-${unitId}`,
    archive: "NARA",
    eadId: unitId,
    level: record.archDesc.level,
    title: unitTitle,
    path: record.path ?? [],
    material: {
      type: materialType || undefined,
      media: mediaType || undefined,
    },
    onlineAvailable: (record.digitalObjectCount ?? 0) > 0,
    createdAt: new Date().toISOString(),
    category: TEMP_CATEGORIES[0],
    customName: "",
    url: `https://catalog.archives.gov/id/${unitId}`,
  };

  return (
    <div className={`${styles.item} ${isSelected ? styles.selected : ""}`}>
      <div className={styles.path}>
        <PathShell
          path={record.path}
          onSelect={(id) => onSelect(String(id))} // ← FIX: konwersja do string
        />
      </div>

      <div className={styles.titleRow}>
        <div className={styles.detailsTitle}>{unitTitle}</div>

        <div className={styles.actions}>
          <BookmarkStar bookmark={bookmark} />
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
        {firstDao && (
          <>
            {" "}
            | [ {firstDao.daoType} -&gt; {firstDao.localType} ]
          </>
        )}
        {!firstDao && materialType && mediaType && (
          <>
            {" "}
            | [ {materialType} -&gt; {mediaType} ]
          </>
        )}
      </div>

      <div className={styles.digitalObjects}>
        Online objects: {record.digitalObjectCount}
      </div>
    </div>
  );
}
