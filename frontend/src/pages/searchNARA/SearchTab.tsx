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
  const [loading, setLoading] = useState(false);

  async function onSearch(form: SearchFormState) {
    setLoading(true);
    try {
      const data = await searchRecords(form);
      setResults(data);
      setSelectedNaId(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SearchLayout
      results={results}
      onSearch={onSearch}
      selectedNaId={selectedNaId}
      onSelect={setSelectedNaId}
      loading={loading}
    />
  );
}
