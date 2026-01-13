// SearchLayout
//
// pages/search/SearchLayout.tsx
import {
  SearchPanel,
  SearchList,
  SearchDetails,
} from "../../components/search";
import { useSearch } from "../../context/SearchContext";
import styles from "./SearchLayout.module.css";

export default function SearchLayout() {
  const { results, selectedRecord, loading, error, clearError } = useSearch();

  return (
    <div className={styles.grid}>
      <SearchPanel />

      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button onClick={clearError}>×</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Searching...</div>
      ) : (
        <SearchList />
      )}

      <SearchDetails />
    </div>
  );
}
