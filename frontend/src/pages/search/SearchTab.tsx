import { useState } from "react";
import {
  SearchLayout,
  searchRecords,
  type SearchFormState,
  type RawRecord,
} from ".";

export default function SearchTab() {
  const [results, setResults] = useState<RawRecord[]>([]);
  const [selectedNaId, setSelectedNaId] = useState<number | null>(null);

  async function onSearch(form: SearchFormState) {
    const data = await searchRecords(form);
    setResults(data);
    setSelectedNaId(null);
  }

  return (
    <SearchLayout
      results={results}
      onSearch={onSearch}
      selectedNaId={selectedNaId}
      onSelect={setSelectedNaId}
    />
  );
}
