import SearchListItemShell from "../../../components/common/search/SearchListItemShell";
import PathBreadcrumbShell from "../../../components/common/search/PathBreadcrumbShell";
import type { RawRecord } from "../../../api/models/record.types";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "../../../styles/commonSearchListItem.module.css";

interface Props {
  record: RawRecord;
  isSelected: boolean;
  onSelect: (naId: number) => void;
}

export default function SearchListItem({
  record,
  isSelected,
  onSelect,
}: Props) {
  const bookmark: Bookmark = {
    id: `nara-${record.naId}`,
    originalTitle: record.title,
    archiveName: "NARA",
    level: record.levelDescription,
    recordType: record.materialType || "",
    onlineAvailable: (record.totalDigitalObjects ?? 0) > 0,
    openRef: {
      archive: "NARA",
      id: record.naId,
    },
    category: "",
    customName: "",
  };

  return (
    <SearchListItemShell
      isSelected={isSelected}
      onClick={() => onSelect(record.naId)}
      bookmark={bookmark}
    >
      <PathBreadcrumbShell
        path={record.path.map((p) => ({
          key: p.naId,
          label: p.label,
        }))}
        onSelect={(naId) => onSelect(naId as number)}
      />

      <div
        className={styles.title}
        title={record.description || "Click to view details"}
      >
        {record.title}
      </div>

      <div className={styles.meta}>
        <span className={styles.naid}>NAID: {record.naId}</span>
        <span className={styles.separator}>·</span>
        <span className={styles.level}>{record.levelDescription}</span>

        {record.materialType && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.materialType}>[{record.materialType}</span>
          </>
        )}

        {record.sourceReference && (
          <>
            <span className={styles.separator}>→</span>
            <span className={styles.materialType}>
              {record.sourceReference}]
            </span>
          </>
        )}
      </div>

      {typeof record.totalDigitalObjects === "number" &&
        record.totalDigitalObjects > 0 && (
          <div className={styles.digitalObjects}>
            Digital objects: {record.totalDigitalObjects}
          </div>
        )}
    </SearchListItemShell>
  );
}
