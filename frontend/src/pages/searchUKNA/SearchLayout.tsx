import SearchListShell from "../../components/common/search/SearchListShell";
import { SearchPanel, type SearchFormState } from ".";
import SearchListItem from "./components/SearchListItem";
import SearchDetails from "./components/SearchDetails";
import styles from "../../styles/commonSearchLayout.module.css";
import type { UknaSearchRecord } from "../../api/models/ukna.types";

interface Props {
  results: UknaSearchRecord[];
  onSearch: (form: SearchFormState) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function SearchLayout({
  results,
  onSearch,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className={styles.grid}>
      <SearchPanel onSearch={onSearch} />
      <SearchListShell
        items={results}
        selectedKey={selectedId}
        getKey={(r) => r.id}
        renderItem={(record, isSelected) => (
          <SearchListItem
            record={record}
            isSelected={isSelected}
            onSelect={(id) => onSelect(id)}
          />
        )}
      />
      <SearchDetails selectedId={selectedId} />
    </div>
  );
}
