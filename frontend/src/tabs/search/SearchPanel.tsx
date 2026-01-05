import { useState } from "react";
import { searchRecords } from "../../api/queryApi";
import type { RawRecord } from "../../api/models";

interface Props {
  onResults: (r: RawRecord[]) => void;
}

export default function SearchPanel({ onResults }: Props) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSearch() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data: RawRecord[] = await searchRecords(q);
      onResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel search">
      <div className="panel-title">Search</div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search query…"
      />
      <button onClick={onSearch} disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
    </div>
  );
}
