import SearchListShell from "../../components/common/search/SearchListShell";
import { SearchPanel, type SearchFormState } from ".";
import SearchListItem from "./components/SearchListItem";
import SearchDetails from "./components/SearchDetails";
import styles from "../../styles/commonSearchLayout.module.css";

interface UkSearchRecord {
  id: string; // Cxxxx
  title: string;
  path: { id: string; title: string }[];
  level?: string;
  hasDigitalObjects?: boolean;
}

interface Props {
  results: UkSearchRecord[];
  onSearch: (form: SearchFormState) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
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
            onSelect={onSelect}
          />
        )}
      />
      <SearchDetails selectedId={selectedId} />
    </div>
  );
}
