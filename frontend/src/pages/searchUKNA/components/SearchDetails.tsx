import { useEffect, useState } from "react";
import DetailsPanelShell from "../../../components/common/search/DetailsPanelShell";
import styles from "../../../styles/commonSearchDetails.module.css";
import { getUknaDetails } from "../../../api/services/uknaSearch.service";
import type { UknaDetailsRecord } from "../../../api/models/ukna.types";

interface Props {
  selectedId: string | null;
}

export default function SearchDetails({ selectedId }: Props) {
  const [loading, setLoading] = useState(false);
  const [downloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<UknaDetailsRecord | null>(null);

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
    if (!record) return;
    window.open(record.detailsUrl, "_blank");
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
            <button
              onClick={onPreview}
              disabled={!record.hasPreview}
              className={styles.downloadButton}
              title="View images"
            >
              👁
            </button>

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
      )} */}
    </DetailsPanelShell>
  );
}
