// SearchDetails.tsx
import { useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { parseRecordDetails } from "../../api/utils/recordParser";
import { getLevelLabel } from "../../api/models/archive.types";
import styles from "./SearchDetails.module.css";
import PreviewViewer from "./PreviewViewer";
import { useDownloadObjects } from "../../api/hooks/useDownloadObjects";

interface SearchDetailsProps {
  setBusy: (value: boolean) => void;
}

export default function SearchDetails({ setBusy }: SearchDetailsProps) {
  const { selectedRecord } = useSearch();
  type RecordDetails = ReturnType<typeof parseRecordDetails>;
  type DigitalObjects = RecordDetails["digitalObjects"];
  if (!selectedRecord) {
    return <div className={styles.empty}>Select a record to view details</div>;
  }
  const details = parseRecordDetails(selectedRecord);
  const { download } = useDownloadObjects({
    recordId: details.recordId,
    setBusy,
  });

  const [activeObjects, setActiveObjects] = useState<DigitalObjects | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  async function handlePreview() {
    setBusy(true);
    try {
      setActiveObjects(details.digitalObjects);
      setActiveIndex(0);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>{details.title}</h2>

      <div className={styles.metadata}>
        <div className={styles.metadataRow}>
          <span className={styles.label}>ID:</span>
          <span className={styles.value}>{details.recordId}</span>
        </div>
        <div className={styles.metadataRow}>
          <span className={styles.label}>Type:</span>
          <span className={styles.value}>{getLevelLabel(details.level)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {details.digitalObjects.length > 0 && (
          <button className={styles.actionButton} onClick={handlePreview}>
            Preview
          </button>
        )}

        {details.digitalObjects.length > 0 && (
          <button
            className={styles.actionButton}
            onClick={() => download(details.digitalObjects)}
          >
            Download All
          </button>
        )}

        <button
          className={styles.actionButton}
          onClick={() => window.open(details.openWebUrl, "_blank")}
        >
          Open in Web
        </button>
      </div>

      {details.description && (
        <div className={styles.description}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p>{details.description}</p>
        </div>
      )}

      {details.objectSummary.length > 0 && (
        <div className={styles.onlineObjects}>
          <h3 className={styles.sectionTitle}>Online objects</h3>
          <ul className={styles.objectSummaryList}>
            {details.objectSummary.map((item, idx) => (
              <li key={idx} className={styles.objectSummaryItem}>
                <span className={styles.objectType}>{item.type}</span>
                <span className={styles.objectCount}> {item.count}</span>
                {item.count === 1 && (
                  <button
                    className={styles.viewButton}
                    onClick={() => {
                      const found = details.digitalObjects.find(
                        (dao) => (dao.localType || dao.daoType) === item.type
                      );
                      if (found) {
                        setActiveObjects([found]);
                        setActiveIndex(0);
                      }
                    }}
                  >
                    View
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {details.microfilm && (
        <div className={styles.microfilm}>
          <h3 className={styles.sectionTitle}>Microfilm</h3>
          <p>{details.microfilm}</p>
        </div>
      )}

      {(details.accessRestriction || details.useRestriction) && (
        <div
          className={`${styles.restrictions} ${
            details.isRestricted
              ? styles.restrictionsErr
              : styles.restrictionsOk
          }`}
        >
          <h3 className={styles.sectionTitle}>Access and Use Restrictions</h3>

          {details.accessRestriction && (
            <div className={styles.restrictionRow}>
              <span className={styles.label}>Access:</span>
              <span className={styles.value}>{details.accessRestriction}</span>
            </div>
          )}

          {details.useRestriction && (
            <div className={styles.restrictionRow}>
              <span className={styles.label}>Use:</span>
              <span className={styles.value}>{details.useRestriction}</span>
              {details.useRestrictionDetails && (
                <span
                  className={styles.tooltip}
                  title={details.useRestrictionDetails}
                >
                  ⓘ
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {activeObjects && activeObjects[activeIndex] && (
        <PreviewViewer
          recordId={details.recordId}
          object={activeObjects[activeIndex]}
          objects={activeObjects}
          onClose={() => setActiveObjects(null)}
          onNext={() => setActiveIndex((i) => (i + 1) % activeObjects.length)}
          onPrev={() =>
            setActiveIndex(
              (i) => (i - 1 + activeObjects.length) % activeObjects.length
            )
          }
        />
      )}
    </div>
  );
}
