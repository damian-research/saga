// SearchDetails
//
import { useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { parseRecordDetails } from "../../api/utils/recordParser";
import styles from "./SearchDetails.module.css";
import PreviewViewer from "./PreviewViewer";

export default function SearchDetails() {
  const { selectedRecord } = useSearch();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!selectedRecord) {
    return <div className={styles.empty}>Select a record to view details</div>;
  }

  const details = parseRecordDetails(selectedRecord);

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
          <span className={styles.value}>{details.level}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {details.digitalObjects.length > 0 && (
          <button
            className={styles.actionButton}
            onClick={() => setActiveIndex(0)}
          >
            Preview
          </button>
        )}
        {details.digitalObjects.length > 0 && (
          <button
            className={styles.actionButton}
            onClick={() => {
              details.digitalObjects.forEach((o) => {
                if (o.href) {
                  window.open(o.href, "_blank");
                }
              });
            }}
          >
            Download All
          </button>
        )}
        <button
          className={styles.actionButton}
          onClick={() => window.open(details.openWebUrl, "_blank")}
        >
          Open Web
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
                      const index = details.digitalObjects.findIndex(
                        (dao) => (dao.localType || dao.daoType) === item.type
                      );
                      if (index !== -1) setActiveIndex(index);
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

      {activeIndex !== null && details.digitalObjects[activeIndex] && (
        <PreviewViewer
          object={details.digitalObjects[activeIndex]}
          objects={details.digitalObjects}
          onClose={() => setActiveIndex(null)}
          onNext={() => {
            if (activeIndex < details.digitalObjects.length - 1) {
              setActiveIndex(activeIndex + 1);
            }
          }}
          onPrev={() => {
            if (activeIndex > 0) {
              setActiveIndex(activeIndex - 1);
            }
          }}
        />
      )}
    </div>
  );
}
