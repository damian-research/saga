import type { RawRecord } from "../../api/models/record.types";
import { SearchListShell } from "../../components/common/search";
import { SearchPanel, SearchPreview, type SearchFormState } from ".";

interface Props {
  results: RawRecord[];
  onSearch: (form: SearchFormState) => void;
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
      <SearchListShell
        results={results}
        selectedNaId={selectedNaId}
        onSelect={onSelect}
      />
      <SearchPreview selectedNaId={selectedNaId} />
    </div>
  );
}
