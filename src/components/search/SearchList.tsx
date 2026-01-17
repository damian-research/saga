// SearchList
//
import { useSearch } from "../../context/SearchContext";
import { getRecordKey } from "../../api/utils/recordParser";
import type { Ead3Response } from "../../api/models/ead3.types";
import styles from "./SearchList.module.css";
import SearchListItem from "./SearchListItem";

export default function SearchList() {
  const { results, selectedRecord } = useSearch();

  if (!results || results.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.title}>Results (0)</div>
      </div>
    );
  }

  const selectedKey = selectedRecord ? getRecordKey(selectedRecord) : null;

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Results ({results.length})</div>

      {results
        .filter((r): r is Ead3Response => Boolean(r))
        .map((record) => {
          const key = getRecordKey(record);
          return (
            <SearchListItem
              key={key}
              record={record}
              isSelected={selectedKey !== null && key === selectedKey}
            />
          );
        })}
    </div>
  );
}
