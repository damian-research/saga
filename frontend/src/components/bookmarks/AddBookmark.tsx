// AddBookmark - REFACTORED
//
import { useState } from "react";
import styles from "./AddBookmark.module.css";
import { TEMP_CATEGORIES, ARCHIVES } from "../../api/models/bookmarks.types";
import type {
  Bookmark,
  WindowMode,
  Category,
  ArchiveName,
} from "../../api/models/bookmarks.types";
import { getRecord } from "../../api/services/searchRecords.service";

interface Props {
  mode: WindowMode;
  bookmark?: Bookmark | null;
  onCancel: () => void;
  onSubmit: (bookmark: Bookmark) => void; // ← zwraca pełny Bookmark
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
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const [archive, setArchive] = useState<ArchiveName>(
    bookmark?.archive ?? "NARA"
  );
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [resolved, setResolved] = useState<Bookmark | null>(bookmark ?? null);

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
                onChange={(e) => {
                  setUrl(e.target.value);
                  setResolved(null);
                  setResolveError(null);
                }}
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

        {(bookmark || resolved) && (
          <div className={styles.preview}>
            <div className={styles.previewTitle}>
              {(resolved ?? bookmark)?.title}
            </div>
            <div className={styles.previewMeta}>
              {(resolved ?? bookmark)?.archive} ·{" "}
              {(resolved ?? bookmark)?.level}
              {(() => {
                const materialType = (resolved ?? bookmark)?.material?.type;
                return materialType ? ` · ${materialType}` : "";
              })()}
            </div>
          </div>
        )}

        {resolveError && <div className={styles.error}>{resolveError}</div>}

        <div className={styles.actions}>
          <button onClick={onCancel}>Cancel</button>
          <button
            disabled={
              resolving ||
              !category ||
              !customName.trim() ||
              (mode === "add-manual" && !url.trim())
            }
            onClick={async () => {
              let base = resolved ?? bookmark;

              // Resolve ONLY in add-manual without base
              if (mode === "add-manual" && !base) {
                const match = url.match(/\/id\/(\d+)/);
                if (!match) {
                  setResolveError("Invalid NARA link");
                  return;
                }

                try {
                  setResolving(true);
                  setResolveError(null);

                  const record = await getRecord(Number(match[1]));
                  if (!record) {
                    setResolveError("Record not found");
                    setResolving(false);
                    return;
                  }

                  // Build base bookmark from resolved record
                  base = {
                    mode: "add-manual",
                    id: crypto.randomUUID(),
                    archive,
                    eadId: String(record.control.recordId),
                    title: record.archDesc.did.unitTitle,
                    level: record.archDesc.level,
                    path: record.path ?? [],
                    onlineAvailable: Boolean(record.digitalObjectCount),
                    category: category as Category,
                    customName: customName.trim(),
                    createdAt: new Date().toISOString(),
                    url: url.trim(),
                  };

                  setResolved(base);
                  setResolving(false);
                } catch {
                  setResolveError("Record not found");
                  setResolving(false);
                  return;
                }
              }

              if (!base) return;

              // Final bookmark with user input
              const final: Bookmark = {
                ...base,
                category: category as Category,
                customName: customName.trim(),
                // Preserve original id and createdAt for edit mode
                id: mode === "edit" ? base.id : base.id || crypto.randomUUID(),
                createdAt: base.createdAt || new Date().toISOString(),
              };

              onSubmit(final);
            }}
          >
            {resolving ? "Resolving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
