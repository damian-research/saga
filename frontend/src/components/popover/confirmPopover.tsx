// confirmPopover
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "../../components/icons";
import styles from "./ConfirmPopover.module.css";

interface ConfirmPopoverProps {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export function ConfirmPopover({
  open,
  text,
  onConfirm,
  onCancel,
  anchorRef,
}: ConfirmPopoverProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }

    if (open) {
      window.addEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || !anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();

  const popoverContent = (
    <>
      <div className={styles.backdrop} onClick={onCancel} />
      <div
        className={styles.popover}
        style={{
          position: "fixed",
          top: `${rect.bottom + 6}px`,
          right: `${window.innerWidth - rect.right}px`,
        }}
      >
        <div className={styles.text}>{text}</div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            <X size={16} />
          </button>
          <button
            className={styles.confirm}
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            <Check size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(popoverContent, document.body);
}
