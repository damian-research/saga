import type { Ead3Response } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";

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
  const digitalObjectCount =
    record.archDesc.dsc?.components?.reduce(
      (sum, c) => sum + (c.did.daoSet?.daos?.length ?? 0),
      0
    ) ?? 0;

  // Fallback "material type chain" if no DAO
  let materialType = "";
  let mediaType = "";
  if (!firstDao) {
    materialType = Array.isArray(record.archDesc.localType)
      ? record.archDesc.localType.join(" / ")
      : record.archDesc.localType || "";
    mediaType = record.archDesc.dsc?.head || "";
  }

  return (
    <div className={styles.item}>
      <div className={styles.path}>
        <PathShell path={record.path} onSelect={(id) => onSelect(id)} />
      </div>

      <div className={styles.detailsTitle}>{unitTitle}</div>

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

      {digitalObjectCount > 0 && (
        <div className={styles.digitalObjects}>
          Digital objects: {digitalObjectCount}
        </div>
      )}
    </div>
  );
}
