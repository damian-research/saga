import { useState } from "react";
import type { Bookmark } from "../../../api/models/bookmarks.types";
import styles from "./AddBookmark.module.css";

interface Props {
  mode: "add" | "edit";
  bookmark?: Bookmark | null;
  categories: string[];
  onCancel: () => void;
  onSubmit: (data: { category: string; customName: string }) => void;
}

export default function AddBookmark({
  mode,
  bookmark,
  categories,
  onCancel,
  onSubmit,
}: Props) {
  const [category, setCategory] = useState(bookmark?.category ?? "");
  const [customName, setCustomName] = useState(bookmark?.customName ?? "");

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {mode === "add" ? "Add bookmark" : "Edit bookmark"}
        </div>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Custom name
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Required"
          />
        </label>

        {bookmark && (
          <div className={styles.preview}>
            <div className={styles.previewTitle}>{bookmark.originalTitle}</div>
            <div className={styles.previewMeta}>
              {bookmark.archiveName} · {bookmark.level} · {bookmark.recordType}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={onCancel}>Cancel</button>
          <button
            disabled={!category || !customName.trim()}
            onClick={() =>
              onSubmit({
                category,
                customName: customName.trim(),
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
