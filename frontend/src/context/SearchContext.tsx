// context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Ead3Response } from "../api/models/ead3.types";
import type { SearchFormState } from "../components/search";
import {
  searchRecords,
  getRecord,
} from "../api/services/searchRecords.service";

interface SearchContextValue {
  // State
  results: Ead3Response[];
  selectedRecord: Ead3Response | null;
  loading: boolean;
  error: string | null;

  // Actions
  search: (form: SearchFormState) => Promise<void>;
  selectRecord: (record: Ead3Response) => void;
  selectByPathSegment: (segmentId: string) => Promise<void>;
  clearError: () => void;
  clearResults: () => void;
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
  const [error, setError] = useState<string | null>(null);

  async function search(form: SearchFormState) {
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecords(form);
      setResults(data);
      setSelectedRecord(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      console.error("Search error:", err);
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

      // Opcjonalnie: dodaj do results jeśli nie ma
      setResults((prev) => {
        const exists = prev.some(
          (r) => r.archDesc?.did?.unitId?.text === segmentId
        );
        return exists ? prev : [record, ...prev];
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load record";
      setError(errorMessage);
      console.error("Load record error:", err);
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
        clearError,
        clearResults,
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
