import type { DigitalObject } from "../../../api/models/nara.types";
import styles from "./PreviewViewer.module.css";

type NaraPreviewProps = {
  archive: "NARA";
  object: DigitalObject;
  objects: DigitalObject[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
};

type UknaPreviewProps = {
  archive: "UKNA";
  uknaRecordId: string;
  onClose: () => void;
};

type Props = NaraPreviewProps | UknaPreviewProps;

export default function PreviewViewer(props: Props) {
  if (props.archive === "UKNA") {
    return (
      <div className={styles.previewRoot}>
        <iframe
          src={`https://discovery.nationalarchives.gov.uk/details/r/${props.uknaRecordId}#imageViewerLink`}
          title="UK National Archives Image Viewer"
          className={styles.previewIframe}
        />
        <button onClick={props.onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    );
  }

  // NARA path (unchanged)
  const { object, objects, onClose } = props;

  const currentIndex = objects.findIndex(
    (o) => o.objectUrl === object.objectUrl
  );
  const hasNext = currentIndex < objects.length - 1;
  const hasPrev = currentIndex > 0;

  const onPrev = () => {
    if ("onPrev" in props && props.onPrev) {
      props.onPrev();
      return;
    }
    if (currentIndex > 0) {
      window.dispatchEvent(
        new CustomEvent("preview:navigate", {
          detail: { index: currentIndex - 1 },
        })
      );
    }
  };

  const onNext = () => {
    if ("onNext" in props && props.onNext) {
      props.onNext();
      return;
    }
    if (currentIndex < objects.length - 1) {
      window.dispatchEvent(
        new CustomEvent("preview:navigate", {
          detail: { index: currentIndex + 1 },
        })
      );
    }
  };

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
              onClick={async () => {
                // NARA (existing behavior)
                try {
                  const res = await fetch(object.objectUrl);
                  const blob = await res.blob();

                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");

                  a.href = url;
                  a.download = object.objectUrl.split("/").pop() ?? "download";

                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);

                  URL.revokeObjectURL(url);
                } catch (e) {
                  console.error("Download failed", e);
                  window.open(object.objectUrl, "_blank");
                }
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
