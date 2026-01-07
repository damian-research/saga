import type { RawRecord } from "../../api/models/record.types";
import {
  SearchPanel,
  SearchList,
  SearchPreview,
  type SearchFormState,
} from ".";

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
      <SearchList
        results={results}
        selectedNaId={selectedNaId}
        onSelect={onSelect}
      />
      <SearchPreview selectedNaId={selectedNaId} />
    </div>
  );
}
