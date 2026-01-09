import { useState } from "react";
import { SearchLayout, type SearchFormState } from ".";
import { searchUkna } from "../../api/services/uknaSearch.service";
import type { UknaSearchParams } from "../../api/dto/uknaSearch.dto";
import type { UknaSearchRecord } from "../../api/models/ukna.types";

export default function SearchTab() {
  const [results, setResults] = useState<UknaSearchRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
    setSelectedId(null);
  }

  return (
    <SearchLayout
      results={results}
      onSearch={onSearch}
      selectedId={selectedId}
      onSelect={setSelectedId}
    />
  );
}
