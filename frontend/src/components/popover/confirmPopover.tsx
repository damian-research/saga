// confirmPopover
import { useEffect } from "react";
import { Check, X } from "../../components/icons";
import styles from "./ConfirmPopover.module.css";

interface ConfirmPopoverProps {
  open: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopover({
  open,
  text,
  onConfirm,
  onCancel,
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

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onCancel} />
      <div className={styles.popover}>
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
}
