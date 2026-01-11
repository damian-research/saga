import type { Ead3Response, Bookmark } from ".";
import styles from "./SearchListItem.module.css";
import PathShell from "./PathShell";

interface PathSegment {
  key: string | number;
  label: string;
}

interface SearchListItemProps {
  record: Ead3Response;
  isSelected: boolean;
  onSelect: (key: string | number) => void;
}

export default function SearchListItem({
  record,
  isSelected,
  onSelect,
}: SearchListItemProps) {
  const key =
    record.archDesc?.did?.unitId?.text ||
    (record.control?.recordId ? record.control.recordId : "");

  const archive: "NARA" | "UK" = "NARA";

  const onlineAvailable = !!record.archDesc?.dsc?.components?.some(
    (component) =>
      component.did?.daoSet?.daos && component.did.daoSet.daos.length > 0
  );

  const bookmark: Bookmark = {
    id: `ead3-${key}`,
    originalTitle: record.archDesc.did.unitTitle,
    archiveName: archive,
    level: record.archDesc?.level || "",
    recordType: "",
    onlineAvailable,
    openRef: {
      archive,
      id: key,
    },
    category: "",
    customName: "",
  };

  const isBookmarked = false; // TODO: wire to store

  const path: PathSegment[] = [];

  return (
    <div className={`${styles.item} ${isSelected ? styles.active : ""}`}>
      <div className={styles.content}>
        <PathShell path={path} onSelect={onSelect} />
        <div className={styles.title}>{record.archDesc.did.unitTitle}</div>

        <div className={styles.meta}>
          {record.archDesc.did.unitDate?.text && (
            <span>{record.archDesc.did.unitDate.text}</span>
          )}
          {record.archDesc.level && (
            <>
              <span className={styles.separator}>|</span>
              <span className={styles.level}>{record.archDesc.level}</span>
            </>
          )}
          {onlineAvailable && (
            <>
              <span className={styles.separator}>|</span>
              <span>Online</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <div
          className={styles.star}
          onClick={(e) => {
            e.stopPropagation();
            // TODO: toggle bookmark placeholder (no-op for now)
          }}
        >
          ☆
        </div>
        <div
          className={styles.clickZone}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(key);
          }}
        >
          <div className={styles.arrow}>›</div>
        </div>
      </div>
    </div>
  );
}
