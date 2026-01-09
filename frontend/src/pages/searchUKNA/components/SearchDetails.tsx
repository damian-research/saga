import { useEffect, useState } from "react";
import DetailsPanelShell from "../../../components/common/search/DetailsPanelShell";
import { PreviewViewer } from "../../../components/common/search";
import BookmarkStar from "../../../components/common/bookmarks/BookmarkStar";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "../../../styles/commonSearchDetails.module.css";

interface Props {
  selectedId: string | null;
}

export default function SearchDetails({ selectedId }: Props) {
  //const [record, setRecord] = useState<FullRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [viewingObject, setViewingObject] = useState<DigitalObject | null>(
  //   null
  // );

  useEffect(() => {
    if (!selectedId) {
      //setRecord(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    // getRecord(selectedId)
    //   .then(setRecord)
    //   .catch(() => setError("Failed to load record"))
    //   .finally(() => setLoading(false));
  }, [selectedId]);

  async function onDownload() {
    if (!selectedId) return;
    window.open(
      `https://discovery.nationalarchives.gov.uk/details/r/${selectedId}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (!selectedId) {
    return <DetailsPanelShell isEmpty />;
  }

  return (
    <DetailsPanelShell
      isLoading={loading}
      error={error}
      isEmpty={true}
      headerAction={
        true && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className={styles.downloadButton}
            title="Download record"
          >
            ↓
          </button>
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
