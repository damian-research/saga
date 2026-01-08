import { useState } from "react";

interface Props {
  onSearch: (form: SearchFormState) => void;
}

export interface SearchFormState {
  q: string; // REQUIRED

  limit: number;

  title?: string;
  naId?: string; // string → może zawierać CSV

  onlineAvailable: boolean;

  personOrOrg?: string;
  dataSource?: string;

  levelOfDescription?:
    | "recordGroup"
    | "collection"
    | "series"
    | "fileUnit"
    | "item";

  recordGroupNumber?: string;

  microfilmId?: string; // CSV
  localId?: string; // CSV
}

export default function SearchPanel({ onSearch }: Props) {
  const [form, setForm] = useState<SearchFormState>({
    q: "",
    limit: 50,
    onlineAvailable: true,
  });

  function update<K extends keyof SearchFormState>(
    key: K,
    value: SearchFormState[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function hasAnySearchValue(form: SearchFormState) {
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

  function submit() {
    if (!hasAnySearchValue(form)) return;
    onSearch(form);
  }

  return (
    <div className="panel search">
      <div className="panel-title">Search in US National Archives</div>

      {/* CORE */}
      <label>
        Query
        <input
          type="text"
          value={form.q}
          onChange={(e) => update("q", e.target.value)}
        />
      </label>

      <label>
        Limit
        <input
          type="number"
          value={form.limit}
          onChange={(e) => update("limit", Number(e.target.value))}
        />
      </label>

      <div className="checkbox-row">
        <label>
          <span>Online available</span>
          <input
            type="checkbox"
            checked={form.onlineAvailable}
            onChange={(e) => update("onlineAvailable", e.target.checked)}
          />
        </label>
      </div>

      <div className="divider" />
      <div className="panel-subtitle">Text & Authority</div>

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

      <div className="divider" />
      <div className="panel-subtitle">Structure</div>
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
          <option value="recordGroup">Record Group</option>
          <option value="collection">Collection</option>
          <option value="series">Series</option>
          <option value="fileUnit">File Unit</option>
          <option value="item">Item</option>
        </select>
      </label>

      <label>
        RG #
        <input
          type="number"
          placeholder="e.g. 11, 59"
          onChange={(e) => update("recordGroupNumber", e.target.value)}
        />
      </label>

      <div className="divider" />
      <div className="panel-subtitle">Identifiers</div>
      <label>
        NAID
        <input
          type="text"
          placeholder="single or CSV"
          onChange={(e) => update("naId", e.target.value)}
        />
      </label>

      <label>
        Microfilm ID
        <input
          type="number"
          placeholder="M234, T455"
          onChange={(e) => update("microfilmId", e.target.value)}
        />
      </label>

      <label>
        Local ID
        <input
          type="text"
          placeholder="M2-3-4, T-45-5"
          onChange={(e) => update("localId", e.target.value)}
        />
      </label>

      <button
        className="search-button"
        onClick={submit}
        disabled={!hasAnySearchValue(form)}
      >
        Search
      </button>
    </div>
  );
}
