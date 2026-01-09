import { useState } from "react";
import styles from "../../styles/commonSearchPanel.module.css";

interface Props {
  onSearch: (form: SearchFormState) => void;
}

/**
 * UK Discovery search form state.
 * This maps directly to Discovery advanced-search parameters.
 */
export interface SearchFormState {
  q: string; // REQUIRED main query

  // Scope / filters
  onlyOnline: boolean;
  dateFrom?: number;
  dateTo?: number;

  // Catalogue levels (Discovery L1–L3)
  levels: Array<1 | 2 | 3 | 6 | 7>;

  // Department / collection code (e.g. CAB, FO, BT)
  department?: string;
}

const LEVEL_LABELS: Record<1 | 2 | 3 | 6 | 7, string> = {
  1: "Department",
  2: "Division",
  3: "Series",
  6: "Piece",
  7: "Item",
};

export default function SearchPanel({ onSearch }: Props) {
  const [form, setForm] = useState<SearchFormState>({
    q: "",
    onlyOnline: true,
    levels: [7],
  });

  function update<K extends keyof SearchFormState>(
    key: K,
    value: SearchFormState[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleLevel(level: 1 | 2 | 3 | 6 | 7) {
    setForm((f) => ({
      ...f,
      levels: f.levels.includes(level)
        ? f.levels.filter((l) => l !== level)
        : [...f.levels, level],
    }));
  }

  function hasAnySearchValue(form: SearchFormState) {
    return Boolean(form.q?.trim());
  }

  function runSearch() {
    console.log("UKNA Search clicked", form);
    onSearch(form);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.title}>Search in UK National Archives</div>

      <label>
        Query
        <input
          type="text"
          value={form.q}
          onChange={(e) => update("q", e.target.value)}
        />
      </label>

      <div className={styles.checkboxRow}>
        <label>
          <span>Only online</span>
          <input
            type="checkbox"
            checked={form.onlyOnline}
            onChange={(e) => update("onlyOnline", e.target.checked)}
          />
        </label>
      </div>

      <div className={styles.divider} />
      <div className={styles.subtitle}>Catalogue level</div>

      {([1, 2, 3, 6, 7] as const).map((l) => (
        <div key={l} className={styles.checkboxRow}>
          <label>
            <span>{LEVEL_LABELS[l]}</span>
            <input
              type="checkbox"
              checked={form.levels.includes(l)}
              onChange={() => toggleLevel(l)}
            />
          </label>
        </div>
      ))}

      <div className={styles.divider} />
      <div className={styles.subtitle}>Date range</div>

      <label>
        From year
        <input
          type="number"
          placeholder="e.g. 1925"
          value={form.dateFrom ?? ""}
          onChange={(e) =>
            update(
              "dateFrom",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
      </label>

      <label>
        To year
        <input
          type="number"
          placeholder="e.g. 1945"
          value={form.dateTo ?? ""}
          onChange={(e) =>
            update(
              "dateTo",
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
      </label>

      <div className={styles.divider} />
      <div className={styles.subtitle}>Department</div>

      <label>
        Department code
        <input
          type="text"
          placeholder="CAB, FO, BT…"
          value={form.department ?? ""}
          onChange={(e) => update("department", e.target.value)}
        />
      </label>

      <button
        className={styles.button}
        onClick={runSearch}
        disabled={!hasAnySearchValue(form)}
      >
        Search
      </button>
    </div>
  );
}
