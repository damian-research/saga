// SearchLayout
//
import {
  SearchPanel,
  SearchList,
  SearchDetails,
} from "../../components/search";
import { useSearch } from "../../context/SearchContext";
import styles from "./SearchLayout.module.css";
import { Loader } from "../../components/loaders/Loader";

export default function SearchLayout() {
  const { loading, error, clearError } = useSearch();

  return (
    <div className={styles.grid}>
      <SearchPanel />

      {error && (
        <div className={`${styles.error} ${styles[`error-${error.type}`]}`}>
          <span>{error.message}</span>
          <button
            onClick={clearError}
            className={styles.errorClose}
            title="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader size="large" />
          <span className={styles.loadingText}>Searching...</span>
        </div>
      ) : (
        <SearchList />
      )}

      <SearchDetails />
    </div>
  );
}
