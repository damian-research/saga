// SearchList
// 
import styles from "./SearchList.module.css";
import type { Ead3Response } from ".";
import SearchListItem from "./SearchListItem";

interface Props {
  items: Ead3Response[];
  selectedKey: string | number | null;
  onSelect: (id: string | number) => void;
}

function getRecordKey(record: Ead3Response): string | number {
  return record.archDesc?.did?.unitId?.text ?? record.control.recordId;
}

export default function SearchList({ items, selectedKey, onSelect }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.title}>Results</div>
        <div className={styles.empty}>No results found</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Results ({items.length})</div>
      {items.map((record) => {
        const key = getRecordKey(record);
        return (
          <SearchListItem
            key={key}
            record={record}
            isSelected={key === selectedKey}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
