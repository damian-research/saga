import { useEffect, useState } from "react";
import {
  getRecord,
  downloadRecord,
} from "../../../api/services/naraSearch.service";
import type { FullRecord, DigitalObject } from "../../../api/models/nara.types";
import {
  PreviewViewer,
  DetailsPanelShell,
} from "../../../components/common/search";
import BookmarkStar from "../../../components/common/bookmarks/BookmarkStar";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "../../../styles/commonSearchDetails.module.css";

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

  function buildObjectBookmark(
    record: FullRecord,
    object: DigitalObject,
    index: number
  ): Bookmark {
    return {
      id: `nara-${record.naId}-obj-${index}`,
      originalTitle: record.title,
      archiveName: "NARA",
      level: "DigitalObject",
      recordType: object.objectType,
      onlineAvailable: true,
      openRef: {
        archive: "NARA",
        id: record.naId,
      },
      category: "",
      customName: "",
    };
  }

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
    } catch (err) {
      setError("Download failed");
    } finally {
      setDownloading(false);
    }
  }

  if (!selectedNaId) {
    return <DetailsPanelShell isEmpty />;
  }

  return (
    <DetailsPanelShell
      isLoading={loading}
      error={error}
      isEmpty={!record}
      headerAction={
        record && (
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
      {record && (
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
      )}
    </DetailsPanelShell>
  );
}
