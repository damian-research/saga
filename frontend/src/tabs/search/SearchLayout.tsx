import type { RawRecord } from "../../api/models";
import SearchList from "./SearchList";
import SearchPreview from "./SearchPreview";
import SearchPanel from "./SearchPanel";

interface Props {
  results: RawRecord[];
  onSearch: (form: import("./SearchPanel").SearchFormState) => void;
  selectedNaId: number | null;
  onSelect: (id: number) => void;
}

export default function SearchLayout({
  results,
  onSearch,
  selectedNaId,
  onSelect,
}: Props) {
  return (
    <div className="search-grid">
      <SearchPanel onSearch={onSearch} />
      <SearchList
        results={results}
        selectedNaId={selectedNaId}
        onSelect={onSelect}
      />
      <SearchPreview selectedNaId={selectedNaId} />
    </div>
  );
}
