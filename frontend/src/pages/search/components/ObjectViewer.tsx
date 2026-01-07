import type { DigitalObject } from "../../../api/models/record.types";

interface Props {
  object: DigitalObject;
  objects: DigitalObject[];
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export default function ObjectViewer({
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
    <div className="object-viewer-overlay" onClick={onClose}>
      <div className="object-viewer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 16px",
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
            borderRadius: "6px 6px 0 0",
          }}
        >
          {/* Left spacer */}
          <div style={{ width: "95px" }}></div>

          {/* Center - Title + Counter */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 600,
                color: "#222",
              }}
            >
              {object.objectType}
            </h3>
            <span
              style={{
                fontSize: "12px",
                color: "#999",
                padding: "2px 6px",
                backgroundColor: "#f0f0f0",
                borderRadius: "3px",
              }}
            >
              {currentIndex + 1} / {objects.length}
            </span>
          </div>

          {/* Right - Download + Close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "60px",
              justifyContent: "flex-end",
            }}
          >
            <button
              title="Download this object"
              onClick={() => {
                const a = document.createElement("a");
                a.href = object.objectUrl;
                a.download = "";
                a.click();
              }}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                padding: 0,
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
              }}
            >
              ↓
            </button>
            <button
              onClick={onClose}
              title="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                padding: 0,
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20px",
                height: "20px",
              }}
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
