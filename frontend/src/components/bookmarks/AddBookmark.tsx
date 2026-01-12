import { useState } from "react";
import styles from "./AddBookmark.module.css";
import { TEMP_CATEGORIES, ARCHIVES } from "../../api/models/bookmarks.types";
import type {
  Bookmark,
  Category,
  ArchiveName,
} from "../../api/models/bookmarks.types";
import type { Ead3Response } from "../../api/models/ead3.types";
import { getRecord } from "../../api/services/searchRecords.service";
import { mapEad3ToBookmark } from "../../api/utils/ead3.mapper";

interface Props {
  mode: "add-manual" | "add-from-search";
  record?: Ead3Response;
  bookmark?: Bookmark | null; // only for edit-from-bookmarks
  onCancel: () => void;
  onSubmit: (bookmark: Bookmark) => void;
}

export default function AddBookmark({
  mode,
  record,
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
  const [base, setBase] = useState<Bookmark | null>(bookmark ?? null);

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {bookmark ? "Change bookmark" : "Add bookmark"}
        </div>

        {mode === "add-manual" && (
          <>
            <label>
              Link
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setBase(null);
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

        {base && (
          <div className={styles.preview}>
            <div className={styles.previewTitle}>{base.title}</div>
            <div className={styles.previewMeta}>
              {base.ead3.localType ? ` · ${base.ead3.localType}` : ""}
              {base.ead3.digitalObjectCount > 0
                ? ` · Online: ${base.ead3.digitalObjectCount}`
                : ""}
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
              (mode === "add-manual" && !bookmark && !url.trim())
            }
            onClick={async () => {
              let resolved: Bookmark | null = base;

              // EDIT
              if (bookmark) {
                resolved = bookmark;
              }

              // ADD-MANUAL
              else if (mode === "add-manual" && !resolved) {
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

                  resolved = mapEad3ToBookmark(record, {
                    mode,
                    category: category as Category,
                    customName,
                    url,
                  });

                  setBase(resolved);
                  setResolving(false);
                } catch {
                  setResolveError("Record not found");
                  setResolving(false);
                  return;
                }
              }

              // ADD-FROM-SEARCH
              else if (mode === "add-from-search" && record && !resolved) {
                resolved = mapEad3ToBookmark(record, {
                  mode,
                  category: category as Category,
                  customName,
                  url,
                });
              }

              if (!resolved) return;

              const final: Bookmark = {
                ...resolved,
                eadId: resolved.eadId ?? record?.control?.recordId ?? null,
                url: resolved.url || url,
                category: category as Category,
                customName: customName.trim(),
                createdAt: resolved.createdAt ?? new Date().toISOString(),
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
