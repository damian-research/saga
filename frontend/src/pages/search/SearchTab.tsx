// SearchTab
//
import { useState } from "react";
import { SearchLayout, searchRecords, type SearchFormState } from ".";
import { SearchProvider } from "../../context/SearchContext";
import type { Ead3Response } from "../../api/models/ead3.types";

export default function SearchTab() {
  return (
    <SearchProvider>
      <SearchLayout />
    </SearchProvider>
  );
}
