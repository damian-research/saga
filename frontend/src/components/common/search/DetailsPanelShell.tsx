import React from "react";

interface Props {
  title?: string;
  isEmpty?: boolean;
  isLoading?: boolean;
  error?: string | null;
  emptyText?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DetailsPanelShell({
  title = "Details",
  isEmpty,
  isLoading,
  error,
  emptyText = "Select a record to view details",
  children,
  footer,
}: Props) {
  return (
    <div className="panel preview">
      <div className="panel-title">{title}</div>

      {isLoading && <div className="preview-empty">Loading…</div>}

      {!isLoading && error && <div className="preview-error">{error}</div>}

      {!isLoading && !error && isEmpty && (
        <div className="preview-empty">{emptyText}</div>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className="preview-content">{children}</div>
      )}

      {footer && <div className="preview-actions">{footer}</div>}
    </div>
  );
}
