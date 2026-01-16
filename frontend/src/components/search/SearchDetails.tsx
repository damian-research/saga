// SearchDetails.tsx
import { useState, useRef } from "react";
import { Eye, ScanSearch, Globe, Download } from "../../components/icons";
import { useSearch } from "../../context/SearchContext";
import { parseRecordDetails } from "../../api/utils/recordParser";
import { getLevelLabel } from "../../api/models/archive.types";
import { BookmarkStar } from "../bookmarks";
import styles from "./SearchDetails.module.css";
import PreviewViewer from "./PreviewViewer";
import { useDownloadObjects } from "../../api/hooks/useDownloadObjects";
import { ConfirmPopover } from "../../components/popover/confirmPopover";

interface SearchDetailsProps {
  setBusy: (value: boolean) => void;
  showBookmarkAction?: boolean;
}

export default function SearchDetails({
  setBusy,
  showBookmarkAction = true,
}: SearchDetailsProps) {
  const { selectedRecord, searchWithin } = useSearch();
  type RecordDetails = ReturnType<typeof parseRecordDetails>;
  type DigitalObjects = RecordDetails["digitalObjects"];
  if (!selectedRecord) {
    return <div className={styles.empty}>Select a record to view details</div>;
  }
  const details = parseRecordDetails(selectedRecord);
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<DigitalObjects>([]);
  const { download } = useDownloadObjects({
    recordId: details.recordId,
    setBusy,
  });

  function handleDownload(objects: DigitalObjects) {
    if (objects.length > 30) {
      setPendingDownload(objects);
      setDownloadConfirmOpen(true);
    } else {
      download(objects);
    }
  }

  async function handleSearchWithin() {
    if (!selectedRecord) return;
    setBusy(true);
    try {
      await searchWithin(selectedRecord);
    } finally {
      setBusy(false);
    }
  }

  // DESCRIPTION
  const [showFullDesc, setShowFullDesc] = useState(false);
  const MAX_DESC_LENGTH = 300;
  const truncatedDesc = details.description?.slice(0, MAX_DESC_LENGTH);
  const needsTruncate = (details.description?.length ?? 0) > MAX_DESC_LENGTH;

  const [activeObjects, setActiveObjects] = useState<DigitalObjects | null>(
    null
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // PREVIEW
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
      {/* BUTTONS */}
      <div className={styles.actions}>
        {details.digitalObjects.length > 0 && (
          <button
            className={styles.actionButton}
            onClick={handlePreview}
            title="Preview documents"
          >
            <Eye size={20} strokeWidth={2} />
          </button>
        )}

        {details.digitalObjects.length > 0 && (
          <button
            ref={removeButtonRef}
            className={styles.actionButton}
            onClick={() => handleDownload(details.digitalObjects)}
            title="Download ALL documents within this unit"
          >
            <Download size={20} strokeWidth={2} />
          </button>
        )}
        <ConfirmPopover
          open={downloadConfirmOpen}
          text={`You are about to download ${pendingDownload.length} files.\nThis may take some time and put load on the server.\n\nContinue?`}
          onConfirm={() => {
            download(pendingDownload);
            setDownloadConfirmOpen(false);
          }}
          onCancel={() => setDownloadConfirmOpen(false)}
          anchorRef={removeButtonRef}
        />

        {details.level !== "item" && details.level !== "fileUnit" && (
          <button
            className={styles.actionButton}
            onClick={handleSearchWithin}
            title="Run search within this unit"
          >
            <ScanSearch size={20} strokeWidth={2} />
          </button>
        )}

        <button
          className={styles.actionButton}
          onClick={() => window.open(details.openWebUrl, "_blank")}
          title="Open NARA website catalog"
        >
          <Globe size={20} strokeWidth={2} />
        </button>
        {showBookmarkAction && <BookmarkStar record={selectedRecord} />}
      </div>

      {/* DESCRIPTION */}
      {details.description && (
        <div className={styles.description}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p>
            {showFullDesc ? details.description : truncatedDesc}
            {needsTruncate && !showFullDesc && "..."}
          </p>
          {needsTruncate && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowFullDesc(!showFullDesc)}
            >
              {showFullDesc ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {details.objectSummary.length > 0 && (
        <div className={styles.onlineObjects}>
          <h3 className={styles.sectionTitle}>Online objects</h3>
          <ul className={styles.objectSummaryList}>
            {details.objectSummary.map((item, idx) => (
              <li key={idx} className={styles.objectSummaryItem}>
                <span className={styles.objectType}>{item.type}</span>
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
                    title="Preview document"
                  >
                    <Eye size={18} strokeWidth={2} />
                  </button>
                )}
                <span className={styles.objectCount}> {item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* ROLLS */}
      {details.microfilm && (
        <div className={styles.microfilm}>
          <h3 className={styles.sectionTitle}>Microfilm</h3>
          <p>{details.microfilm}</p>
        </div>
      )}
      {/* RESTRICTIONS */}
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
