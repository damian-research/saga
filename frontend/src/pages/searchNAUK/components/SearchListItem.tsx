import SearchListItemShell from "../../../components/common/search/SearchListItemShell";
import PathBreadcrumbShell from "../../../components/common/search/PathBreadcrumbShell";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "../../../styles/commonSearchListItem.module.css";

interface UkSearchRecord {
  id: string; // Cxxxx
  title: string;
  path: { id: string; title: string }[];
  level?: string;
  hasDigitalObjects?: boolean;
}

interface Props {
  record: UkSearchRecord;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function SearchListItem({
  record,
  isSelected,
  onSelect,
}: Props) {
  const bookmark: Bookmark = {
    id: `ukna-${record.id}`,
    originalTitle: record.title,
    archiveName: "UK", // CHANGE FROM "UK NA" to "UK"
    level: record.level || "Unknown",
    recordType: "",
    onlineAvailable: record.hasDigitalObjects ?? false,
    openRef: {
      archive: "UK", // CHANGE FROM "UKNA" to "UK"
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
      <PathBreadcrumbShell
        path={record.path.map((p) => ({
          key: p.id,
          label: p.title,
        }))}
        onSelect={(id) => onSelect(id as string)}
      />

      <div className={styles.title} title="Click to view details">
        {record.title}
      </div>

      <div className={styles.meta}>
        <span className={styles.naid}>ID: {record.id}</span>
        {record.level && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.level}>{record.level}</span>
          </>
        )}
      </div>

      {record.hasDigitalObjects && (
        <div className={styles.digitalObjects}>Digital objects available</div>
      )}
    </SearchListItemShell>
  );
}
