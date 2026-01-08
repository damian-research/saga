import type { DigitalObject } from "../../../api/models/record.types";
import "../../../styles/ObjectViewer.css";

interface Props {
  object: DigitalObject;
  objects: DigitalObject[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSaveBookmark?: () => void;
  isSaved?: boolean;
}

export default function ObjectViewer({
  object,
  objects,
  onClose,
  onNext,
  onPrev,
  onSaveBookmark,
  isSaved,
}: Props) {
  const currentIndex = objects.findIndex(
    (o) => o.objectUrl === object.objectUrl
  );
  const hasNext = currentIndex < objects.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="object-viewer-overlay" onClick={onClose}>
      <div className="object-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="object-viewer-header">
          {/* Left spacer */}
          <div style={{ width: "95px" }}></div>
          {/* Title + Counter */}
          <div className="object-viewer-title-section">
            <h3 className="object-viewer-title">{object.objectType}</h3>
            <span className="object-viewer-counter">
              {currentIndex + 1} / {objects.length}
            </span>
          </div>
          {/* Actions */}
          <div className="object-viewer-header-actions">
            {onSaveBookmark && (
              <button
                className="object-viewer-save-btn"
                title={isSaved ? "Saved" : "Save to Bookmarks"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveBookmark();
                }}
              >
                {isSaved ? "★" : "☆"}
              </button>
            )}
            <button
              className="object-viewer-download-btn "
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
            <button
              className="object-viewer-close"
              onClick={onClose}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="object-viewer-container">
          {hasPrev && (
            <button
              className="object-viewer-edge-nav object-viewer-edge-prev"
              onClick={onPrev}
              title="Previous object"
            >
              ←
            </button>
          )}

          <div className="object-viewer-body">
            {object.objectUrl.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={object.objectUrl}
                title={object.objectType}
                className="object-viewer-iframe"
              />
            ) : object.objectUrl
                .toLowerCase()
                .match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={object.objectUrl}
                alt={object.objectType}
                className="object-viewer-image"
              />
            ) : (
              <div className="object-viewer-message">
                <p>Unable to preview this object type.</p>
                <a
                  href={object.objectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="object-viewer-link"
                >
                  Open in new tab
                </a>
              </div>
            )}
          </div>

          {hasNext && (
            <button
              className="object-viewer-edge-nav object-viewer-edge-next"
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
