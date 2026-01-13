// SearchTab
//
import { SearchLayout } from ".";
import { SearchProvider } from "../../context/SearchContext";

export default function SearchTab() {
  return (
    <SearchProvider>
      <SearchLayout />
    </SearchProvider>
  );
}
