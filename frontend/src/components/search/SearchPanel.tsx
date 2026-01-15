// SearchPanel.tsx
import { useEffect, useState } from "react";
import { Search, XCircle, X } from "../../components/icons";
import styles from "./SearchPanel.module.css";
import { useSearch } from "../../context/SearchContext";
import { LEVELS, LEVEL_LABELS } from "../../api/models/archive.types";
import type { SearchFormState } from "../../api/models/search.types";

interface SearchPanelProps {
  setBusy: (value: boolean) => void;
}

type SearchMode = "search" | "within";

export default function SearchPanel({ setBusy }: SearchPanelProps) {
  const {
    search,
    clearResults,
    searchForm,
    setSearchForm,
    withinForm,
    setWithinForm,
    activeFilter,
    submitSearch,
  } = useSearch();
  const [mode, setMode] = useState<SearchMode>("search");

  // Get active form and setter based on mode
  const form = mode === "search" ? searchForm : withinForm;
  const setForm = mode === "search" ? setSearchForm : setWithinForm;

  function update<K extends keyof SearchFormState>(
    key: K,
    value: SearchFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (activeFilter?.type === "within") {
      setMode("within");
      const ancestorNaId = activeFilter.record?.archDesc.did.unitId.text; //archDesc?.did?.unitId?.text;
      const onlineAvailable = false;
      const firstChildOnly = true;
      if (ancestorNaId) {
        setForm((prev) => ({
          ...prev,
          ancestorNaId,
          onlineAvailable,
          firstChildOnly,
        }));
      }
    }
  }, [activeFilter, setWithinForm]);

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
        form.localId?.trim() ||
        form.ancestorNaId?.trim()
    );
  }

  async function submit() {
    if (!hasAnySearchValue(form)) return;

    setBusy(true);
    try {
      await submitSearch(form, mode === "within");
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

    clearResults();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if (!hasAnySearchValue(form)) return;

    e.preventDefault();
    submit();
  }

  function isFilled(value: unknown): boolean {
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return true;
    if (typeof value === "boolean") return value === true;
    return value != null;
  }

  return (
    <div className={styles.panel} onKeyDown={handleKeyDown}>
      {/* Archive selector */}
      <select className={styles.archiveSelector}>
        <option value="nara">US National Archives</option>
      </select>
      <div className={styles.divider} />

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            mode === "search" ? styles.tabActive : ""
          }`}
          onClick={() => setMode("search")}
        >
          Search
        </button>
        <button
          className={`${styles.tab} ${
            mode === "within" ? styles.tabActive : ""
          }`}
          onClick={() => setMode("within")}
        >
          Search Within
        </button>
      </div>

      {/* TAB 1: Search */}
      {mode === "search" && (
        <>
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
        </>
      )}

      {/* TAB 2: Search Within (identical for now) */}
      {mode === "within" && (
        <>
          <label>
            Parent NAID
            <input
              type="text"
              placeholder="single or CSV"
              value={form.ancestorNaId ?? ""}
              onChange={(e) => update("ancestorNaId", e.target.value)}
            />
          </label>

          <label>
            Query
            <input
              type="text"
              value={form.q}
              onChange={(e) => update("q", e.target.value)}
              autoFocus
              onFocus={(e) => e.target.select()}
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
              <span>First level</span>
              <input
                type="checkbox"
                checked={form.firstChildOnly}
                onChange={(e) => update("firstChildOnly", e.target.checked)}
              />
            </label>
          </div>

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
              onFocus={(e) => e.target.select()}
            />
          </label>

          <label>
            Person / Organization
            <input
              type="text"
              placeholder="authority heading"
              value={form.personOrOrg ?? ""}
              onChange={(e) => update("personOrOrg", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </label>

          <label>
            Data Source
            <input
              type="text"
              placeholder="e.g. description"
              value={form.dataSource ?? ""}
              onChange={(e) => update("dataSource", e.target.value)}
              onFocus={(e) => e.target.select()}
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
        </>
      )}
      {/* ACTIONS */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.clearButton}
          onClick={clearForm}
          disabled={!hasAnySearchValue(form)}
          title="Clear form and results"
        >
          <XCircle size={20} strokeWidth={2} />
        </button>

        <button
          type="button"
          className={styles.button}
          onClick={submit}
          disabled={!hasAnySearchValue(form)}
          title="Search in the Archvie Catalog"
        >
          <Search size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
