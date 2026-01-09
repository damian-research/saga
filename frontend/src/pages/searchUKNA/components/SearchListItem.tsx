import SearchListItemShell from "../../../components/common/search/SearchListItemShell";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "../../../styles/commonSearchListItem.module.css";
import type { UknaSearchRecord } from "../../../api/models/ukna.types";

interface Props {
  record: UknaSearchRecord;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Department",
  2: "Division",
  3: "Series",
  6: "Piece",
  7: "Item",
};

export default function SearchListItem({
  record,
  isSelected,
  onSelect,
}: Props) {
  const bookmark: Bookmark = {
    id: `ukna-${record.id}`,
    originalTitle: record.title,
    archiveName: "UK",
    level: LEVEL_LABELS[record.level] ?? "Unknown",
    recordType: "",
    onlineAvailable: record.hasDigitalObjects ?? false,
    openRef: {
      archive: "UK",
      id: record.id,
    },
    category: "",
    customName: "",
  };

  return (
    <SearchListItemShell
      isSelected={isSelected}
      onClick={() => onSelect(record.id)}
      bookmark={bookmark}
    >
      <div className={styles.title} title="Click to view details">
        {record.title}
      </div>

      <div className={styles.meta}>
        <span className={styles.naid}>ID: {record.id}</span>
        {record.level && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.level}>{LEVEL_LABELS[record.level]}</span>
          </>
        )}
      </div>

      {record.hasDigitalObjects && (
        <div className={styles.digitalObjects}>Digital objects available</div>
      )}
    </SearchListItemShell>
  );
}
