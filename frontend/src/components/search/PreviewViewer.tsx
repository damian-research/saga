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
  // ZOOM
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey) return;

    e.preventDefault();

    setZoom((z) => {
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const next = z + delta;
      return Math.min(3, Math.max(1, next));
    });
  };

  // LOADER
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [object.href]);

  // NAVI
  const currentIndex = objects.findIndex((o) => o.href === object.href);
  const isSingle = objects.length <= 1;
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSingle && e.key === "ArrowLeft") onPrev();
      if (!isSingle && e.key === "ArrowRight") onNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose, isSingle]);

  const handlePrev = () => {
    onPrev();
  };

  const handleNext = () => {
    onNext();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setIsPanning(true);
    setStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
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
        {/* HEADER */}
        <div className={styles.header}>
          <div style={{ width: "95px" }} />
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.counterWrapper}>
              <select
                className={styles.counterSelect}
                value={currentIndex}
                onChange={(e) => {
                  const targetIndex = Number(e.target.value);
                  const diff = targetIndex - currentIndex;
                  if (diff === 0) return;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else {
                    for (let i = 0; i < Math.abs(diff); i++) onPrev();
                  }
                }}
              >
                {objects.map((_, idx) => (
                  <option key={idx} value={idx}>
                    {idx + 1}
                  </option>
                ))}
              </select>
              <span className={styles.counterLabel}>/ {objects.length}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.zoomBtn}
              title="Reset zoom to 100%"
              onClick={resetZoom}
            >
              {Math.round(zoom * 100)}%
            </button>
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
        {/* Viewer */}
        {!isSingle && (
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

          <div
            className={`${styles.body} ${zoom > 1 ? styles.pannable : ""}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {object.href.toLowerCase().endsWith(".pdf") ? (
              <div
                className={styles.zoomWrapper}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <iframe
                  src={object.href}
                  title={title}
                  className={styles.iframe}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  draggable={false}
                />
              </div>
            ) : object.href.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <div
                className={styles.zoomWrapper}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                }}
              >
                <img
                  src={object.href}
                  alt={title}
                  className={styles.image}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
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

        {!isSingle && (
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
