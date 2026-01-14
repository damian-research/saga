// SearchDetails.tsx
import { useState } from "react";
import { useSearch } from "../../context/SearchContext";
import { parseRecordDetails } from "../../api/utils/recordParser";
import styles from "./SearchDetails.module.css";
import PreviewViewer from "./PreviewViewer";

interface SearchDetailsProps {
  setBusy: (value: boolean) => void;
}

export default function SearchDetails({ setBusy }: SearchDetailsProps) {
  const { selectedRecord } = useSearch();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!selectedRecord) {
    return <div className={styles.empty}>Select a record to view details</div>;
  }

  const details = parseRecordDetails(selectedRecord);

  async function handlePreview() {
    setBusy(true);
    try {
      setActiveIndex(0);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownloadAll() {
    const objects = details.digitalObjects.filter((o) => o.href);
    const count = objects.length;

    if (count === 0) return;

    if (count > 30) {
      const confirmed = window.confirm(
        `You are about to download ${count} files.\n\nThis may take some time and put load on the server.\n\nDo you want to continue?`
      );
      if (!confirmed) return;
    }

    setBusy(true);
    try {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      for (const object of objects) {
        try {
          const res = await fetch(object.href);
          const blob = await res.blob();

          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");

          a.href = url;
          const originalName = object.href.split("/").pop() ?? "download";
          a.download = `${details.recordId}-${originalName}`;

          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          URL.revokeObjectURL(url);
          await delay(300);
        } catch (e) {
          console.error("Download failed", e);
          window.open(object.href, "_blank");
        }
      }
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
          <span className={styles.value}>{details.level}</span>
        </div>
      </div>

      <div className={styles.actions}>
        {details.digitalObjects.length > 0 && (
          <button className={styles.actionButton} onClick={handlePreview}>
            Preview
          </button>
        )}

        {details.digitalObjects.length > 0 && (
          <button className={styles.actionButton} onClick={handleDownloadAll}>
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
          recordId={details.recordId}
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
