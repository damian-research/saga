import type { Dao } from ".";
import styles from "./PreviewViewer.module.css";

type Props = {
  object: Dao;
  objects: Dao[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
};

export default function PreviewViewer(props: Props) {
  const { object, objects, onClose } = props;

  const currentIndex = objects.findIndex((o) => o.href === object.href);
  const hasNext = currentIndex < objects.length - 1;
  const hasPrev = currentIndex > 0;

  const onPrev = () => {
    if (props.onPrev) {
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
    if (props.onNext) {
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

  const title =
    [object.localType, object.daoType !== "derived" ? object.daoType : null]
      .filter(Boolean)
      .join(" – ") || "Digital Object";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.viewer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div style={{ width: "95px" }}></div>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.counter}>
              {currentIndex + 1} / {objects.length}
            </span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.downloadBtn}
              title="Download this object"
              onClick={async () => {
                try {
                  const res = await fetch(object.href);
                  const blob = await res.blob();

                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");

                  a.href = url;
                  a.download = object.href.split("/").pop() ?? "download";

                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);

                  URL.revokeObjectURL(url);
                } catch (e) {
                  console.error("Download failed", e);
                  window.open(object.href, "_blank");
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
            {object.href.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={object.href}
                title={title}
                className={styles.iframe}
              />
            ) : object.href.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img src={object.href} alt={title} className={styles.image} />
            ) : (
              <div className={styles.message}>
                <p>Unable to preview this object type.</p>
                <a
                  href={object.href}
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
