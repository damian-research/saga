import { useEffect, useState } from "react";
import { getRecord, downloadRecord } from "../../api/services/queryService";
import type { FullRecord } from "../../api/models/record.types";

interface Props {
  selectedNaId: number | null;
}

export default function SearchPreview({ selectedNaId }: Props) {
  const [record, setRecord] = useState<FullRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedNaId) {
      setRecord(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    getRecord(selectedNaId)
      .then(setRecord)
      .catch(() => setError("Failed to load record"))
      .finally(() => setLoading(false));
  }, [selectedNaId]);

  async function onDownload() {
    if (!record) return;
    setDownloading(true);
    try {
      await downloadRecord(record.naId);
      // ✅ Optional: show success message
    } catch (err) {
      setError("Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (!selectedNaId) {
    return <div className="panel preview">Select a record to preview</div>;
  }

  if (loading) {
    return <div className="panel preview">Loading…</div>;
  }

  if (error) {
    return <div className="panel preview error">{error}</div>;
  }

  if (!record) {
    return <div className="panel preview">No data</div>;
  }

  return (
    <div className="panel preview">
      <div className="panel-title">Preview</div>
      <h3>{record.title}</h3>

      <div className="breadcrumbs">
        {record.ancestors
          .slice()
          .sort((a, b) => b.distance - a.distance)
          .map((a) => a.title)
          .join(" → ")}
      </div>

      {/* ✅ Check if digitalObjects exist */}
      {record.digitalObjects.length > 0 ? (
        <ul>
          {record.digitalObjects.map((o, i) => (
            <li key={i}>
              {o.objectType} —{" "}
              <a href={o.objectUrl} target="_blank" rel="noopener noreferrer">
                open
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No digital objects available</p>
      )}

      <button onClick={onDownload} disabled={downloading}>
        {downloading ? "Downloading…" : "Download"}
      </button>
    </div>
  );
}
