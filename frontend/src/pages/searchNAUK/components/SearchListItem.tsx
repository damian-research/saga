import SearchListItemShell from "../../../components/common/search/SearchListItemShell";
import PathBreadcrumbShell from "../../../components/common/search/PathBreadcrumbShell";

interface UkSearchRecord {
  id: string; // Cxxxx
  title: string;
  path: { id: string; title: string }[];
  level?: string;
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
  return (
    <SearchListItemShell
      isSelected={isSelected}
      onClick={() => onSelect(record.id)}
    >
      <PathBreadcrumbShell
        path={record.path.map((p) => ({
          key: p.id,
          label: p.title,
        }))}
        onSelect={(id) => onSelect(id as string)}
      />

      <div className="title">{record.title}</div>

      {record.level && (
        <div className="item-meta">
          <span className="level">{record.level}</span>
        </div>
      )}
    </SearchListItemShell>
  );
}
