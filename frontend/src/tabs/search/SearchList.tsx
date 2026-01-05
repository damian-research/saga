import type { RawRecord } from "../../api/models";

interface Props {
  results: RawRecord[];
  selectedNaId: number | null;
  onSelect: (id: number) => void;
}

export default function SearchList({ results, selectedNaId, onSelect }: Props) {
  return (
    <div className="panel list">
      <div className="panel-title">Results</div>
      {results.map((r) => (
        <div
          key={r.naId}
          className={`list-item ${r.naId === selectedNaId ? "active" : ""}`}
          onClick={() => onSelect(r.naId)}
        >
          <div className="title">{r.title}</div>
          <div className="meta">
            {r.level}
            {r.ancestors?.length
              ? " · " + r.ancestors.map((a) => a.title).join(" → ")
              : ""}
          </div>
          {r.totalDigitalObjects !== undefined && (
            <div className="meta">Digital objects: {r.totalDigitalObjects}</div>
          )}
        </div>
      ))}
    </div>
  );
}
