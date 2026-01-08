import type { RawRecord } from "../../../api/models/record.types";
import { SearchListItemShell } from ".";

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
        <SearchListItemShell
          key={r.naId}
          record={r}
          isSelected={r.naId === selectedNaId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
