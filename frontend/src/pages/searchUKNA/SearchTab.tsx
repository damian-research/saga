import { useState } from "react";
import { SearchLayout, type SearchFormState } from ".";
import { searchUkna } from "../../api/services/uknaSearch.service";
import type { UknaSearchParams } from "../../api/dto/uknaSearch.dto";

/**
 * UK National Archives search tab.
 * Logic will evolve (browse vs details),
 * but structure mirrors NARA intentionally.
 */
export default function SearchTab() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedCId, setSelectedCId] = useState<string | null>(null);

  async function onSearch(form: SearchFormState) {
    const params: UknaSearchParams = {
      q: form.q,
      onlyOnline: form.onlyOnline,
      levels: form.levels,
      dateFrom: form.dateFrom,
      dateTo: form.dateTo,
      department: form.department,
    };

    const data = await searchUkna(params);
    setResults(data);
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
