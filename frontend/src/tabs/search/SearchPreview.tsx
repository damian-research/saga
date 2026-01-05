import { useEffect, useState } from "react";
import { getRecord } from "../../api/queryApi";
import type { FullRecord } from "../../api/models";
import { downloadRecord } from "../../api/queryApi";

interface Props {
  selectedNaId: number | null;
}

export default function SearchPreview({ selectedNaId }: Props) {
  const [record, setRecord] = useState<FullRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!selectedNaId) {
      setRecord(null);
      return;
    }

    setLoading(true);
    getRecord(selectedNaId)
      .then(setRecord)
      .finally(() => setLoading(false));
  }, [selectedNaId]);

  if (!selectedNaId) {
    return <div className="panel preview">No record selected</div>;
  }

  if (loading || !record) {
    return <div className="panel preview">Loading…</div>;
  }

  async function onDownload() {
    if (!record) return;
    setDownloading(true);
    try {
      await downloadRecord(record.naId);
    } finally {
      setDownloading(false);
    }
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

      <ul>
        {record.digitalObjects.map((o, i) => (
          <li key={i}>
            {o.objectType} —{" "}
            <a href={o.objectUrl} target="_blank">
              open
            </a>
          </li>
        ))}
      </ul>
      <button onClick={onDownload} disabled={downloading}>
        {downloading ? "Downloading…" : "Download"}
      </button>
    </div>
  );
}
