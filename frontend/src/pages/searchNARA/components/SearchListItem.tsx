import SearchListItemShell from "../../../components/common/search/SearchListItemShell";
import PathBreadcrumbShell from "../../../components/common/search/PathBreadcrumbShell";
import type { RawRecord } from "../../../api/models/record.types";

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
  return (
    <SearchListItemShell
      isSelected={isSelected}
      onClick={() => onSelect(record.naId)}
    >
      <PathBreadcrumbShell
        path={record.path.map((p) => ({
          key: p.naId,
          label: p.label,
        }))}
        onSelect={(naId) => onSelect(naId as number)}
      />

      <div
        className="title"
        title={record.description || "Click to view details"}
      >
        {record.title}
      </div>

      <div className="item-meta">
        <span className="naid">NAID: {record.naId}</span>
        <span className="separator">·</span>
        <span className="level">{record.levelDescription}</span>

        {record.materialType && (
          <>
            <span className="separator">·</span>
            <span className="material-type">[{record.materialType}]</span>
          </>
        )}

        {record.sourceReference && (
          <>
            <span className="separator">→</span>
            <span className="source-reference">{record.sourceReference}</span>
          </>
        )}
      </div>

      {typeof record.totalDigitalObjects === "number" &&
        record.totalDigitalObjects > 0 && (
          <div className="digital-objects">
            Digital objects: {record.totalDigitalObjects}
          </div>
        )}
    </SearchListItemShell>
  );
}
