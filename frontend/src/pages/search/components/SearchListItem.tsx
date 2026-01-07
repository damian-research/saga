import type { RawRecord } from "../../../api/models/record.types";
import PathBreadcrumb from "./PathBreadcrumb";

interface Props {
  record: RawRecord;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export default function SearchListItem({
  record,
  isSelected,
  onSelect,
}: Props) {
  return (
    <div className={`list-item ${isSelected ? "active" : ""}`}>
      <div className="list-item-content">
        <PathBreadcrumb path={record.path} onSelect={onSelect} />
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
              <span className="material-type">[{record.materialType}</span>
            </>
          )}
          {record.sourceReference && (
            <>
              <span className="separator">→</span>
              <span className="source-reference">
                {record.sourceReference}]
              </span>
            </>
          )}
        </div>
        {typeof record.totalDigitalObjects === "number" &&
          record.totalDigitalObjects > 0 && (
            <div className="digital-objects">
              Digital objects: {record.totalDigitalObjects}
            </div>
          )}
      </div>
      <div className="list-item-click" onClick={() => onSelect(record.naId)}>
        <span className="list-item-arrow">›</span>
      </div>
    </div>
  );
}
