import type { DigitalObject } from "../../../api/models/record.types";
import styles from "./PreviewViewer.module.css";

interface Props {
  object: DigitalObject;
  objects: DigitalObject[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function PreviewViewer({
  object,
  objects,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const currentIndex = objects.findIndex(
    (o) => o.objectUrl === object.objectUrl
  );
  const hasNext = currentIndex < objects.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.viewer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div style={{ width: "95px" }}></div>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{object.objectType}</h3>
            <span className={styles.counter}>
              {currentIndex + 1} / {objects.length}
            </span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.downloadBtn}
              title="Download this object"
              onClick={() => {
                const a = document.createElement("a");
                a.href = object.objectUrl;
                a.download = "";
                a.click();
              }}
            >
              ↓
            </button>
            <button className={styles.closeBtn} onClick={onClose} title="Close">
              ×
            </button>
          </div>
        </div>

        <div className={styles.container}>
          {hasPrev && (
            <button
              className={`${styles.edgeNav} ${styles.edgePrev}`}
              onClick={onPrev}
              title="Previous object"
            >
              ←
            </button>
          )}

          <div className={styles.body}>
            {object.objectUrl.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={object.objectUrl}
                title={object.objectType}
                className={styles.iframe}
              />
            ) : object.objectUrl
                .toLowerCase()
                .match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={object.objectUrl}
                alt={object.objectType}
                className={styles.image}
              />
            ) : (
              <div className={styles.message}>
                <p>Unable to preview this object type.</p>
                <a
                  href={object.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Open in new tab
                </a>
              </div>
            )}
          </div>

          {hasNext && (
            <button
              className={`${styles.edgeNav} ${styles.edgeNext}`}
              onClick={onNext}
              title="Next object"
            >
              →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
