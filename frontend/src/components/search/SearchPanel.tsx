// SearchPanel.tsx
import { useState } from "react";
import styles from "./SearchPanel.module.css";
import type { SearchFormState } from ".";
import { useSearch } from "../../context/SearchContext";
import { LEVELS, LEVEL_LABELS } from "../../api/models/archive.types";

interface SearchPanelProps {
  setBusy: (value: boolean) => void;
}

export default function SearchPanel({ setBusy }: SearchPanelProps) {
  const { search } = useSearch();

  const [form, setForm] = useState<SearchFormState>({
    q: "",
    limit: 50,
    onlineAvailable: true,
  });

  function update<K extends keyof SearchFormState>(
    key: K,
    value: SearchFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function hasAnySearchValue(form: SearchFormState): boolean {
    return Boolean(
      form.q?.trim() ||
        form.title?.trim() ||
        form.naId?.trim() ||
        form.personOrOrg?.trim() ||
        form.dataSource?.trim() ||
        form.levelOfDescription ||
        form.recordGroupNumber?.trim() ||
        form.microfilmId?.trim() ||
        form.localId?.trim()
    );
  }

  async function submit() {
    if (!hasAnySearchValue(form)) return;

    setBusy(true);
    try {
      await search(form);
    } finally {
      setBusy(false);
    }
  }

  function clearForm() {
    setForm({
      q: "",
      limit: 50,
      onlineAvailable: true,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if (!hasAnySearchValue(form)) return;

    e.preventDefault();
    submit();
  }

  return (
    <div className={styles.panel} onKeyDown={handleKeyDown}>
      <div className={styles.title}>Search in US National Archives</div>

      <label>
        Query
        <input
          type="text"
          value={form.q}
          onChange={(e) => update("q", e.target.value)}
          autoFocus
        />
      </label>

      <label>
        Limit
        <input
          type="number"
          min={1}
          max={100}
          value={form.limit}
          onChange={(e) => update("limit", Number(e.target.value))}
        />
      </label>

      <div className={styles.checkboxRow}>
        <label>
          <span>Online available</span>
          <input
            type="checkbox"
            checked={form.onlineAvailable}
            onChange={(e) => update("onlineAvailable", e.target.checked)}
          />
        </label>
      </div>

      <div className={styles.divider} />
      <div className={styles.subtitle}>Text & Authority</div>

      <label>
        Title
        <input
          type="text"
          placeholder="title contains"
          value={form.title ?? ""}
          onChange={(e) => update("title", e.target.value)}
        />
      </label>

      <label>
        Person / Organization
        <input
          type="text"
          placeholder="authority heading"
          value={form.personOrOrg ?? ""}
          onChange={(e) => update("personOrOrg", e.target.value)}
        />
      </label>

      <label>
        Data Source
        <input
          type="text"
          placeholder="e.g. description"
          value={form.dataSource ?? ""}
          onChange={(e) => update("dataSource", e.target.value)}
        />
      </label>

      <div className={styles.divider} />
      <div className={styles.subtitle}>Structure</div>

      <label>
        Level
        <select
          value={form.levelOfDescription ?? ""}
          onChange={(e) =>
            update(
              "levelOfDescription",
              (e.target.value ||
                undefined) as SearchFormState["levelOfDescription"]
            )
          }
        >
          <option value="">Any</option>
          {LEVELS.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      </label>

      <label>
        RG #
        <input
          type="text"
          placeholder="e.g. 11, 59"
          value={form.recordGroupNumber ?? ""}
          onChange={(e) => update("recordGroupNumber", e.target.value)}
        />
      </label>

      <div className={styles.divider} />
      <div className={styles.subtitle}>Identifiers</div>

      <label>
        NAID
        <input
          type="text"
          placeholder="single or CSV"
          value={form.naId ?? ""}
          onChange={(e) => update("naId", e.target.value)}
        />
      </label>

      <label>
        Microfilm ID
        <input
          type="text"
          placeholder="M234, T455"
          value={form.microfilmId ?? ""}
          onChange={(e) => update("microfilmId", e.target.value)}
        />
      </label>

      <label>
        Local ID
        <input
          type="text"
          placeholder="M2-3-4, T-45-5"
          value={form.localId ?? ""}
          onChange={(e) => update("localId", e.target.value)}
        />
      </label>

      <div className={styles.actions}>
        {hasAnySearchValue(form) && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={clearForm}
          >
            Clear
          </button>
        )}

        <button
          type="button"
          className={styles.button}
          onClick={submit}
          disabled={!hasAnySearchValue(form)}
        >
          Search
        </button>
      </div>
    </div>
  );
}
