// SearchLayout
//
import type { Ead3Response } from "../../api/models/ead3.types";
import {
  SearchPanel,
  SearchList,
  SearchDetails,
  type SearchFormState,
} from "../../components/search";
import styles from "./SearchLayout.module.css";

interface Props {
  results: Ead3Response[];
  onSearch: (form: SearchFormState) => void;
  selectedKey: number | string | null;
  onSelect: (id: number | string) => void;
  loading: boolean;
}

export default function SearchLayout({
  results,
  onSearch,
  selectedKey,
  onSelect,
  loading,
}: Props) {
  return (
    <div className={styles.grid}>
      <SearchPanel onSearch={onSearch} loading={loading} />
      {loading ? (
        <div className={styles.loading}>Searching</div>
      ) : (
        <SearchList
          items={results}
          selectedKey={selectedKey}
          onSelect={onSelect}
        />
      )}
      <SearchDetails selectedKey={selectedKey} />
    </div>
  );
}
