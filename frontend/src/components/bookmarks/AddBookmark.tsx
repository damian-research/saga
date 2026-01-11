import { useState } from "react";
import styles from "./AddBookmark.module.css";
import {
  TEMP_CATEGORIES,
  ARCHIVES,
} from "../../api/models/bookmarks.types";
import type {
  Bookmark,
  WindowMode,
  Category,
  ArchiveName,
} from "../../api/models/bookmarks.types";

interface Props {
  mode: WindowMode;
  bookmark?: Bookmark | null;
  onCancel: () => void;
  onSubmit: (data: {
    category: Category;
    customName: string;
    url?: string;
    archive?: ArchiveName;
  }) => void;
}

export default function AddBookmark({
  mode,
  bookmark,
  onCancel,
  onSubmit,
}: Props) {
  const [category, setCategory] = useState<Category | "">(
    bookmark?.category ?? ""
  );
  const [customName, setCustomName] = useState(bookmark?.customName ?? "");
  const [url, setUrl] = useState("");
  const [archive, setArchive] = useState<ArchiveName>("NARA");

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {mode === "add-manual" || mode === "add-from-search"
            ? "Add bookmark"
            : "Edit bookmark"}
        </div>

        {mode === "add-manual" && (
          <>
            <label>
              Link
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://catalog.archives.gov/id/73088101"
              />
            </label>

            <label>
              Archive
              <select
                value={archive}
                onChange={(e) => setArchive(e.target.value as ArchiveName)}
              >
                {ARCHIVES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="">Select category</option>
            {TEMP_CATEGORIES.map((c) => (
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
            <div className={styles.previewTitle}>{bookmark.title}</div>
            <div className={styles.previewMeta}>
              {bookmark.archive} · {bookmark.level}
              {bookmark.material?.type ? ` · ${bookmark.material.type}` : ""}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={onCancel}>Cancel</button>
          <button
            disabled={
              !category ||
              !customName.trim() ||
              (mode === "add-manual" && !url.trim())
            }
            onClick={() =>
              onSubmit({
                category: category as Category,
                customName: customName.trim(),
                url: mode === "add-manual" ? url.trim() : undefined,
                archive: mode === "add-manual" ? archive : undefined,
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
