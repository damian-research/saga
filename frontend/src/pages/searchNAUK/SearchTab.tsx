import { useState } from "react";
import { SearchLayout, type SearchFormState } from ".";

/**
 * UK National Archives search tab.
 * Logic will evolve (browse vs details),
 * but structure mirrors NARA intentionally.
 */
export default function SearchTab() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedCId, setSelectedCId] = useState<string | null>(null);

  async function onSearch(form: SearchFormState) {
    // TODO: replace with Discovery search implementation
    // For now, stub / placeholder
    setResults([]);
    setSelectedCId(null);
  }

  return (
    <SearchLayout
      results={results}
      onSearch={onSearch}
      selectedId={selectedCId}
      onSelect={setSelectedCId}
    />
  );
}
