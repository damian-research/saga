import type { RawRecord } from "../../api/models/nara.types";
import SearchListShell from "../../components/common/search/SearchListShell";
import { SearchPanel, SearchPreview, type SearchFormState } from ".";
import SearchListItem from "./components/SearchListItem";
import styles from "../../styles/commonSearchLayout.module.css";

interface Props {
  results: RawRecord[];
  onSearch: (form: SearchFormState) => void;
  selectedNaId: number | null;
  onSelect: (id: number) => void;
  loading: boolean;
}

export default function SearchLayout({
  results,
  onSearch,
  selectedNaId,
  onSelect,
  loading,
}: Props) {
  return (
    <div className={styles.grid}>
      <SearchPanel onSearch={onSearch} loading={loading} />
      {loading ? (
        <div className={styles.loading}>Searching</div>
      ) : (
        <SearchListShell
          items={results}
          selectedKey={selectedNaId}
          getKey={(r) => r.naId}
          renderItem={(record, isSelected) => (
            <SearchListItem
              record={record}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          )}
        />
      )}
      <SearchPreview selectedNaId={selectedNaId} />
    </div>
  );
}
