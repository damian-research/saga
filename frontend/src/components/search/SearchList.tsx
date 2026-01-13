// SearchList
//
import { useSearch } from "../../context/SearchContext";
import styles from "./SearchList.module.css";
import SearchListItem from "./SearchListItem";
import type { Ead3Response } from ".";

export default function SearchList() {
  const { results, selectedRecord } = useSearch();

  if (!results || results.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.title}>Results (0)</div>
      </div>
    );
  }

  function getRecordKey(record: Ead3Response | null | undefined): string {
    if (!record) return "__invalid__";

    return (
      record.archDesc?.did?.unitId?.text ??
      record.control?.recordId ??
      "__invalid__"
    );
  }

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
              isSelected={
                selectedRecord !== null &&
                getRecordKey(record) === getRecordKey(selectedRecord)
              }
            />
          );
        })}
    </div>
  );
}
