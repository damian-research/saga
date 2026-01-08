import React from "react";
import styles from "./DetailsPanelShell.module.css";

interface Props {
  title?: string;
  isEmpty?: boolean;
  isLoading?: boolean;
  error?: string | null;
  emptyText?: string;
  children?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export default function DetailsPanelShell({
  title = "Details",
  isEmpty,
  isLoading,
  error,
  emptyText = "Select a record to view details",
  children,
  headerAction,
}: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        {headerAction && (
          <div className={styles.headerAction}>{headerAction}</div>
        )}
      </div>

      {isLoading && <div className={styles.empty}>Loading…</div>}

      {!isLoading && error && <div className={styles.error}>{error}</div>}

      {!isLoading && !error && isEmpty && (
        <div className={styles.empty}>{emptyText}</div>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
}
