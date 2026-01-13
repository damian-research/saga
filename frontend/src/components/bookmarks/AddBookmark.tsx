// AddBookmark
//
// AddBookmark.tsx
import { useState } from "react";
import styles from "./AddBookmark.module.css";
import {
  ARCHIVES,
  type BookmarkCategory,
  type ArchiveName,
  type Bookmark,
  type WindowMode,
} from "../../api/models/bookmarks.types";
import type { Ead3Response } from "../../api/models/ead3.types";
import { getRecord } from "../../api/services/searchRecords.service";
import { mapEad3ToBookmark } from "../../api/utils/ead3.mapper";

interface Props {
  mode: WindowMode;
  record?: Ead3Response;
  bookmark?: Bookmark;
  categories: BookmarkCategory[];
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
}

export default function AddBookmark({
  mode,
  record,
  bookmark,
  categories,
  onClose,
  onSave,
}: Props) {
  const [categoryId, setCategoryId] = useState<string>(
    bookmark?.categoryId ?? ""
  );
  const [customName, setCustomName] = useState(bookmark?.customName ?? "");
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const [archive, setArchive] = useState<ArchiveName>(
    bookmark?.archive ?? "NARA"
  );

  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [base, setBase] = useState<Bookmark | null>(bookmark ?? null);

  const isManual = mode === "add-manual";
  const isEdit = mode === "edit";

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {isEdit ? "Change bookmark" : "Add bookmark"}
        </div>

        {isManual && (
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
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Custom name
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </label>

        {resolveError && <div className={styles.error}>{resolveError}</div>}

        <div className={styles.actions}>
          <button
            disabled={resolving || !categoryId || !customName.trim()}
            onClick={async () => {
              if (!categoryId) return;

              let resolved: Bookmark | null = base;

              // EDIT
              if (mode === "edit" && bookmark) {
                resolved = {
                  ...bookmark,
                  categoryId,
                  customName: customName.trim(),
                };
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
                  const record = await getRecord(Number(match[1]));
                  if (!record) throw new Error();

                  resolved = mapEad3ToBookmark(record, {
                    mode,
                    categoryId,
                    customName: customName.trim(),
                    url,
                  });

                  setResolving(false);
                } catch {
                  setResolving(false);
                  setResolveError("Record not found");
                  return;
                }
              }

              // ADD-FROM-SEARCH
              else if (mode === "add-from-search" && record && !resolved) {
                resolved = mapEad3ToBookmark(record, {
                  mode,
                  categoryId,
                  customName: customName.trim(),
                  url,
                });
              }

              if (!resolved) return;

              onSave({
                ...resolved,
                categoryId,
                customName: customName.trim(),
                createdAt: resolved.createdAt ?? new Date().toISOString(),
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
