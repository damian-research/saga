// Preview Viewer
//
import { useEffect, useState } from "react";
import type { Dao } from "../../api/models/ead3.types";
import styles from "./PreviewViewer.module.css";
import { Loader } from "../loaders/Loader";

type Props = {
  recordId: string;
  object: Dao;
  objects: Dao[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function PreviewViewer({
  recordId,
  object,
  objects,
  onClose,
  onNext,
  onPrev,
}: Props) {
  const [loading, setLoading] = useState(true);

  const currentIndex = objects.findIndex((o) => o.href === object.href);
  const hasNext = currentIndex < objects.length - 1;
  const hasPrev = currentIndex > 0;

  useEffect(() => {
    setLoading(true);
  }, [object.href]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, onClose]);

  const handlePrev = () => {
    if (hasPrev) onPrev();
  };

  const handleNext = () => {
    if (hasNext) onNext();
  };

  // TITLE
  const fileName = object.href?.split("/").pop() ?? "";
  const dotIndex = fileName.lastIndexOf(".");
  const page = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
  const extension =
    dotIndex > 0 ? fileName.slice(dotIndex + 1).toUpperCase() : "";
  const mediaType = extension ? `Image (${extension})` : "Digital Object";
  const title = `ID: ${recordId} | Page: ${page} | ${mediaType}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.viewer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div style={{ width: "95px" }} />
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
                  const originalName =
                    object.href.split("/").pop() ?? "download";
                  a.download = `${recordId}-${originalName}`;

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

        {hasPrev && (
          <button
            className={`${styles.edgeNav} ${styles.edgePrev}`}
            onClick={handlePrev}
            title="Previous object"
          >
            ←
          </button>
        )}

        <div className={styles.container}>
          {loading && (
            <div className={styles.loaderOverlay}>
              <Loader size="large" />
            </div>
          )}

          <div className={styles.body}>
            {object.href.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={object.href}
                title={title}
                className={styles.iframe}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            ) : object.href.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={object.href}
                alt={title}
                className={styles.image}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            ) : (
              <div className={styles.message}>
                <p>Unable to preview this object type.</p>
                <a
                  href={object.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  onClick={() => setLoading(false)}
                >
                  Open in new tab
                </a>
              </div>
            )}
          </div>
        </div>

        {hasNext && (
          <button
            className={`${styles.edgeNav} ${styles.edgeNext}`}
            onClick={handleNext}
            title="Next object"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}
