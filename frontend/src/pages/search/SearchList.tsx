import type { RawRecord } from "../../api/models/record.types";

interface Props {
  results: RawRecord[];
  selectedNaId: number | null;
  onSelect: (id: number) => void;
}

export default function SearchList({ results, selectedNaId, onSelect }: Props) {
  if (results.length === 0) {
    return (
      <div className="panel list">
        <div className="panel-title">Results</div>
        <div className="empty-state">No results found</div>
      </div>
    );
  }

  return (
    <div className="panel list">
      <div className="panel-title">Results ({results.length})</div>{" "}
      {results.map((r) => (
        <div
          key={r.naId}
          className={`list-item ${r.naId === selectedNaId ? "active" : ""}`}
          onClick={() => onSelect(r.naId)}
        >
          <div className="path">{r.path.map((p) => p.label).join(" > ")}</div>
          <div className="title">{r.title}</div>
          {r.totalDigitalObjects !== undefined && (
            <div className="meta">Digital objects: {r.totalDigitalObjects}</div>
          )}
        </div>
      ))}
    </div>
  );
}
