// context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type { SearchFormState, SagaTabId } from "../api/models/search.types";
import {
  searchRecords,
  getRecord,
  searchChildren,
} from "../api/services/searchRecords.service";

type SearchMode = "search" | "within";

interface SearchError {
  message: string;
  type: "network" | "validation" | "server" | "unknown";
}

interface ActiveFilter {
  type: "all" | "within" | "archive";
  record?: Ead3Response;
  form?: SearchFormState;
}

interface SearchContextValue {
  // State
  results: Ead3Response[];
  selectedRecord: Ead3Response | null;
  loading: boolean;
  error: SearchError | null;
  activeFilter: ActiveFilter | null;
  activeTab: SagaTabId;
  switchToSearchTab: () => void;
  switchToBookmarksTab: () => void;
  mode: SearchMode;
  setMode: React.Dispatch<React.SetStateAction<SearchMode>>;

  // Actions
  search: (form: SearchFormState) => Promise<void>;
  selectRecord: (record: Ead3Response) => void;
  selectByPathSegment: (segmentId: string) => Promise<void>;
  searchWithin: (record: Ead3Response) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
  submitSearch: (form: SearchFormState, isWithinMode: boolean) => Promise<void>;

  // Separate forms for each tab
  searchForm: SearchFormState;
  setSearchForm: React.Dispatch<React.SetStateAction<SearchFormState>>;
  withinForm: SearchFormState;
  setWithinForm: React.Dispatch<React.SetStateAction<SearchFormState>>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [results, setResults] = useState<Ead3Response[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Ead3Response | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);
  const [mode, setMode] = useState<SearchMode>("search");
  const [activeTab, setActiveTab] = useState<SagaTabId>("search");

  function switchToSearchTab() {
    setActiveTab("search");
  }

  function switchToBookmarksTab() {
    setActiveTab("bookmarks");
  }

  // Separate form states
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    q: "",
    limit: 50,
    onlineAvailable: true,
  });

  const [withinForm, setWithinForm] = useState<SearchFormState>({
    q: "",
    limit: 50,
    onlineAvailable: false,
    firstChildOnly: false,
  });
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);

  async function search(form: SearchFormState) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecords(form);
      setResults(data);
      setSelectedRecord(null);
      setActiveFilter(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Search failed",
        type: err instanceof TypeError ? "network" : "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  function selectRecord(record: Ead3Response) {
    setSelectedRecord(record);
  }

  async function selectByPathSegment(segmentId: string) {
    setLoading(true);
    setError(null);
    try {
      const record = await getRecord(Number(segmentId));
      setSelectedRecord(record);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Search failed",
        type: err instanceof TypeError ? "network" : "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  async function searchWithin(record: Ead3Response) {
    const parentId = record.archDesc?.did?.unitId?.text;
    if (!parentId) {
      setError({ message: "No parent ID found", type: "validation" });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchChildren(parentId, 50);
      setResults(data);
      setSelectedRecord(null);
      setActiveFilter({ type: "within", record });
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Search failed",
        type: err instanceof TypeError ? "network" : "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  // In SearchContext
  async function submitSearch(form: SearchFormState, isWithinMode: boolean) {
    setLoading(true);
    setError(null);
    try {
      let data: Ead3Response[];

      if (isWithinMode && form.firstChildOnly && form.ancestorNaId) {
        // Direct children only
        data = await searchChildren(form.ancestorNaId, form.limit || 50);
      } else {
        // Regular search (with or without ancestorNaId)
        data = await searchRecords(form);
      }

      setResults(data);
      setSelectedRecord(null);
      setActiveFilter(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Search failed",
        type: err instanceof TypeError ? "network" : "unknown",
      });
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  function clearResults() {
    setResults([]);
    setSelectedRecord(null);
  }

  return (
    <SearchContext.Provider
      value={{
        results,
        selectedRecord,
        loading,
        error,
        activeFilter,
        activeTab,
        mode,
        setMode,
        switchToSearchTab,
        switchToBookmarksTab,
        search,
        selectRecord,
        selectByPathSegment,
        searchWithin,
        clearError,
        clearResults,
        searchForm,
        setSearchForm,
        withinForm,
        setWithinForm,
        submitSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
