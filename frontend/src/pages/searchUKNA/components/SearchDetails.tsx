import { useEffect, useState } from "react";
import {
  PreviewViewer,
  DetailsPanelShell,
} from "../../../components/common/search";
import styles from "../../../styles/commonSearchDetails.module.css";
import { getUknaDetails } from "../../../api/services/uknaSearch.service";
import type { UknaDetailsRecord } from "../../../api/models/ukna.types";

interface Props {
  selectedId: string | null;
}

export default function SearchDetails({ selectedId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<UknaDetailsRecord | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setError(null);
      setRecord(null);
      return;
    }

    setLoading(true);
    setError(null);

    getUknaDetails(selectedId)
      .then((data) => {
        setRecord(data);
      })
      .catch(() => {
        setError("Failed to load UK National Archives record");
        setRecord(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedId]);

  async function onDownload() {
    if (!record) return;
    window.open(record.detailsUrl, "_blank", "noopener,noreferrer");
  }

  function onPreview() {
    if (!record || !record.hasPreview) return;
    setShowPreview(true);
  }

  if (!selectedId) {
    return <DetailsPanelShell isEmpty />;
  }

  return (
    <DetailsPanelShell
      isLoading={loading}
      error={error}
      isEmpty={!record}
      headerAction={
        record && (
          <>
            {/* <button
              onClick={onPreview}
              disabled={!record.hasPreview}
              className={styles.downloadButton}
              title="View images"
            >
              👁
            </button> */}

            <button
              onClick={onDownload}
              className={styles.downloadButton}
              title="Open in UK National Archives"
            >
              ↓
            </button>
          </>
        )
      }
    >
      {record && (
        <>
          <h2 className={styles.title}>{record.title}</h2>

          <div className={styles.breadcrumbs}>
            {record.path.map((p, i) => (
              <span key={i}>
                {p.reference ? (
                  <a
                    href={`https://discovery.nationalarchives.gov.uk/browse/r/r/${encodeURIComponent(
                      p.reference
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.breadcrumbLink}
                  >
                    {p.reference} – {p.title}
                  </a>
                ) : (
                  <span>{p.title}</span>
                )}

                {i < record.path.length - 1 && <span> → </span>}
              </span>
            ))}
          </div>
        </>
      )}

      {record && (
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Record access</h4>

          {record.hasPreview ? (
            <button onClick={onPreview} className={styles.button}>
              View images
            </button>
          ) : (
            <p className={styles.emptyState}>
              No images available for this record
            </p>
          )}
        </div>
      )}

      {/* Uncomment when data is ready */}
      {/* {record && (
        <>
          <h2 className={styles.title}>{record.title}</h2>

          <div className={styles.breadcrumbs}>
            {record.ancestors
              .slice()
              .sort((a, b) => b.distance - a.distance)
              .map((a) => a.title)
              .join(" → ")}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Digital Objects</h4>

            {record.digitalObjects.length > 0 ? (
              <ul className={styles.objectsList}>
                {record.digitalObjects.map((o, i) => (
                  <li key={i} className={styles.objectItem}>
                    <span className={styles.objectType}>{o.objectType}</span>

                    <div className={styles.objectActions}>
                      <BookmarkStar
                        bookmark={buildObjectBookmark(record, o, i)}
                      />

                      <button
                        onClick={() => setViewingObject(o)}
                        className={styles.button}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>No digital objects available</p>
            )}
          </div>
        </>
      )}
      )} */}

      {record && showPreview && (
        <PreviewViewer
          archive="UKNA"
          uknaRecordId={record.id}
          onClose={() => setShowPreview(false)}
        />
      )}
    </DetailsPanelShell>
  );
}
