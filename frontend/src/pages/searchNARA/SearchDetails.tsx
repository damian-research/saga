import { useEffect, useState } from "react";
import { getRecord, downloadRecord } from "../../api/services/queryService";
import type { FullRecord, DigitalObject } from "../../api/models/record.types";
import { PreviewViewer } from "../../components/common/search";

interface Props {
  selectedNaId: number | null;
}

export default function SearchDetails({ selectedNaId }: Props) {
  const [record, setRecord] = useState<FullRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingObject, setViewingObject] = useState<DigitalObject | null>(
    null
  );

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
    return (
      <div className="panel preview">
        <div className="panel-title">Details</div>
        <div className="preview-empty">Select a record to view details</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel preview">
        <div className="panel-title">Details</div>
        <div className="preview-empty">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel preview">
        <div className="panel-title">Details</div>
        <div className="preview-error">{error}</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="panel preview">
        <div className="panel-title">Details</div>
        <div className="preview-empty">No data</div>
      </div>
    );
  }

  return (
    <div className="panel preview">
      <div className="panel-title">Details</div>

      <div className="preview-content">
        <h2 className="preview-title">{record.title}</h2>

        <div className="preview-breadcrumbs">
          {record.ancestors
            .slice()
            .sort((a, b) => b.distance - a.distance)
            .map((a) => a.title)
            .join(" → ")}
        </div>

        <div className="preview-section">
          <h4 className="preview-section-title">Digital Objects</h4>
          {record.digitalObjects.length > 0 ? (
            <ul className="preview-objects-list">
              {record.digitalObjects.map((o, i) => (
                <li key={i} className="preview-object-item">
                  <span className="object-type">{o.objectType}</span>
                  <button
                    onClick={() => setViewingObject(o)}
                    className="object-link-btn"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="preview-empty-state">No digital objects available</p>
          )}
        </div>

        <div className="preview-actions">
          <button
            onClick={onDownload}
            disabled={downloading}
            className="btn btn-primary"
          >
            {downloading ? "Downloading…" : "📥 Download Record"}
          </button>
        </div>
      </div>

      {viewingObject && record && (
        <PreviewViewer
          object={viewingObject}
          objects={record.digitalObjects}
          onClose={() => setViewingObject(null)}
          onNext={() => {
            const currentIndex = record.digitalObjects.findIndex(
              (o) => o.objectUrl === viewingObject.objectUrl
            );
            if (currentIndex < record.digitalObjects.length - 1) {
              setViewingObject(record.digitalObjects[currentIndex + 1]);
            }
          }}
          onPrev={() => {
            const currentIndex = record.digitalObjects.findIndex(
              (o) => o.objectUrl === viewingObject.objectUrl
            );
            if (currentIndex > 0) {
              setViewingObject(record.digitalObjects[currentIndex - 1]);
            }
          }}
        />
      )}
    </div>
  );
}
