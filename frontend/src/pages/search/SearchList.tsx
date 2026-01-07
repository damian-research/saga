import type { RawRecord } from "../../api/models/record.types";
import SearchListItem from "./components/SearchListItem";

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
        <SearchListItem
          key={r.naId}
          record={r}
          isSelected={r.naId === selectedNaId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
