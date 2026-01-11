import { useState } from "react";
import {
  SearchLayout,
  searchRecords,
  type SearchFormState,
} from ".";
import type { Ead3Response } from "../../api/models/ead3.types";

export default function SearchTab() {
  const [results, setResults] = useState<Ead3Response[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch(form: SearchFormState) {
    setLoading(true);
    try {
      const data = await searchRecords(form);
      setResults(data);
      setSelectedKey(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SearchLayout
      results={results}
      onSearch={onSearch}
      selectedKey={selectedKey}
      onSelect={setSelectedKey}
      loading={loading}
    />
  );
}
