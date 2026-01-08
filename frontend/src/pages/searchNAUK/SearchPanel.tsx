import { useState } from "react";

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

export default function SearchPanel({ onSearch }: Props) {
  const [form, setForm] = useState<SearchFormState>({
    q: "",
    onlyOnline: true,
    levels: [1, 2, 3, 6, 7],
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

  function submit() {
    if (!hasAnySearchValue(form)) return;
    onSearch(form);
  }

  return (
    <div className="panel search">
      <div className="panel-title">Search in UK National Archives</div>

      {/* CORE */}
      <label>
        Query
        <input
          type="text"
          value={form.q}
          onChange={(e) => update("q", e.target.value)}
        />
      </label>

      <div className="checkbox-row">
        <label>
          <span>Only online</span>
          <input
            type="checkbox"
            checked={form.onlyOnline}
            onChange={(e) => update("onlyOnline", e.target.checked)}
          />
        </label>
      </div>

      <div className="divider" />
      <div className="panel-subtitle">Catalogue level</div>

      <div className="checkbox-grid">
        {[1, 2, 3, 6, 7].map((l) => (
          <label key={l}>
            <input
              type="checkbox"
              checked={form.levels.includes(l as any)}
              onChange={() => toggleLevel(l as any)}
            />
            Level {l}
          </label>
        ))}
      </div>

      <div className="divider" />
      <div className="panel-subtitle">Date range</div>

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

      <div className="divider" />
      <div className="panel-subtitle">Department</div>

      <label>
        Department code
        <input
          type="text"
          placeholder="CAB, FO, BT…"
          value={form.department ?? ""}
          onChange={(e) => update("department", e.target.value)}
        />
      </label>

      <button onClick={submit} disabled={!hasAnySearchValue(form)}>
        Search
      </button>
    </div>
  );
}
