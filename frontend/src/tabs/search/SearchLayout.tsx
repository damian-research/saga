import type { RawRecord } from "../../api/models";
import SearchList from "./SearchList";
import SearchPreview from "./SearchPreview";
import SearchPanel from "./SearchPanel";

interface Props {
  results: RawRecord[];
  onResults: (r: RawRecord[]) => void;
  selectedNaId: number | null;
  onSelect: (id: number) => void;
}

export default function SearchLayout({
  results,
  onResults,
  selectedNaId,
  onSelect,
}: Props) {
  return (
    <div className="search-grid">
      <SearchPanel onResults={onResults} />
      <SearchList
        results={results}
        selectedNaId={selectedNaId}
        onSelect={onSelect}
      />
      <SearchPreview selectedNaId={selectedNaId} />
    </div>
  );
}
