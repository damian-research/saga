import type { Ead3Response } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";
import BookmarkStar from "../bookmarks/BookmarkStar";
import type { Bookmark } from "../../api/models/bookmarks.types";
import { TEMP_CATEGORIES } from "../../api/models/bookmarks.types";

interface SearchListItemProps {
  record: Ead3Response;
  onSelect: (id: string) => void;
}

export default function SearchListItem({
  record,
  onSelect,
}: SearchListItemProps) {
  const unitTitle = record.archDesc.did.unitTitle;
  const unitId = record.archDesc.did.unitId?.text || "";
  const levelRaw = record.archDesc.level || "";
  // LEVEL mapping
  let level = "";
  if (levelRaw === "fileUnit") level = "Item";
  else if (levelRaw === "series") level = "Series";
  else if (levelRaw === "recordgrp") level = "Record Group";

  // First DAO in first component
  const firstDao =
    record.archDesc.dsc?.components?.[0]?.did.daoSet?.daos?.[0] || null;

  // Count ALL DAOs in ALL components
  // const digitalObjectCount =
  //   record.archDesc.dsc?.components?.reduce(
  //     (sum, c) => sum + (c.did.daoSet?.daos?.length ?? 0),
  //     0
  //   ) ?? 0;

  // Fallback "material type chain" if no DAO
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
  };

  return (
    <div className={styles.item}>
      <div className={styles.path}>
        <PathShell path={record.path} onSelect={(id) => onSelect(id)} />
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
