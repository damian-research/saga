// SearchLayout
//
import { useState } from "react";
import {
  SearchPanel,
  SearchList,
  SearchDetails,
} from "../../components/search";
import { useSearch } from "../../context/SearchContext";
import styles from "./SearchLayout.module.css";
import { Loader } from "../../components/loaders/Loader";

export default function SearchLayout() {
  const [isBusy, setIsBusy] = useState(false);
  const { error, clearError } = useSearch();

  return (
    <div className={styles.grid}>
      {isBusy && <Loader fullscreen />}
      <SearchPanel setBusy={setIsBusy} />

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

      <SearchList />

      <SearchDetails setBusy={setIsBusy} />
    </div>
  );
}
