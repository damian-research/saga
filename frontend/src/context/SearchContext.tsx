// context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type { SearchFormState } from "../api/models/search.types";
import {
  searchRecords,
  getRecord,
  searchChildren,
} from "../api/services/searchRecords.service";

interface SearchError {
  message: string;
  type: "network" | "validation" | "server" | "unknown";
}

interface SearchContextValue {
  // State
  results: Ead3Response[];
  selectedRecord: Ead3Response | null;
  loading: boolean;
  error: SearchError | null;

  // Actions
  search: (form: SearchFormState) => Promise<void>;
  selectRecord: (record: Ead3Response) => void;
  selectByPathSegment: (segmentId: string) => Promise<void>;
  searchWithin: (parentId: string) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;

  // Form
  form: SearchFormState;
  setForm: React.Dispatch<React.SetStateAction<SearchFormState>>;
}

const SearchContext = createContext<SearchContextValue | null>(null);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [results, setResults] = useState<Ead3Response[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<Ead3Response | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);
  const [form, setForm] = useState<SearchFormState>({
    q: "",
    limit: 50,
    onlineAvailable: true,
  });

  async function search(form: SearchFormState) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecords(form);
      setResults(data);
      setSelectedRecord(null);
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

  async function searchWithin(parentId: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchChildren(parentId, 50);
      setResults(data);
      setSelectedRecord(null);
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
        search,
        selectRecord,
        selectByPathSegment,
        searchWithin,
        clearError,
        clearResults,
        form,
        setForm,
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
