// AddBookmark.tsx
import { useState, useContext, useMemo } from "react";
import styles from "./AddBookmark.module.css";
import {
  ARCHIVES,
  type ArchiveName,
  type Bookmark,
  type WindowMode,
} from "../../api/models/bookmarks.types";
import type { Ead3Response } from "../../api/models/ead3.types";
import { getRecord } from "../../api/services/searchRecords.service";
import { mapEad3ToBookmark } from "../../api/utils/ead3.mapper";
import { BookmarkContext, TagContext } from "../../context/BookmarkContext";

interface Props {
  mode: WindowMode;
  record?: Ead3Response;
  bookmark?: Bookmark;
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
}

export default function AddBookmark({
  mode,
  record,
  bookmark,
  onClose,
  onSave,
}: Props) {
  // ===== CONTEXT =====
  const bookmarkCtx = useContext(BookmarkContext);
  if (!bookmarkCtx) throw new Error("BookmarkContext missing");

  const tagCtx = useContext(TagContext);
  if (!tagCtx) throw new Error("TagContext missing");

  const { categories } = bookmarkCtx;
  const { tags } = tagCtx;

  // ===== BASIC STATE =====
  const [customName, setCustomName] = useState(bookmark?.customName ?? "");
  const [categoryId, setCategoryId] = useState(bookmark?.categoryId ?? "");
  const [url, setUrl] = useState(bookmark?.url ?? "");
  const [archive, setArchive] = useState<ArchiveName>(
    bookmark?.archive ?? "NARA"
  );

  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [base, setBase] = useState<Bookmark | null>(bookmark ?? null);

  // ===== TAGS (STRICT MODE) =====
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>(bookmark?.tags ?? []);

  const suggestions = useMemo(() => {
    const q = tagInput.trim().toLowerCase();
    if (!q) return [];

    return tags
      .filter(
        (t) =>
          typeof t.name === "string" &&
          t.name.startsWith(q) &&
          !localTags.includes(t.name)
      )
      .slice(0, 6);
  }, [tagInput, tags, localTags]);

  function addExistingTag(name: string) {
    if (localTags.includes(name)) return;
    setLocalTags((prev) => [...prev, name]);
    setTagInput("");
  }

  function removeTag(name: string) {
    setLocalTags((prev) => prev.filter((t) => t !== name));
  }

  const isManual = mode === "add-manual";
  const isEdit = mode === "edit";

  // ===== RENDER =====
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          {isEdit ? "Change bookmark" : "Add bookmark"}
        </div>

        {/* ===== MANUAL SOURCE ===== */}
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

        {/* ===== CATEGORY ===== */}
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

        {/* ===== NAME ===== */}
        <label>
          Custom name
          <input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
        </label>

        {/* ===== TAG INPUT (STRICT) ===== */}
        <label>
          Tags
          <input
            value={tagInput}
            placeholder="Start typing tag name…"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </label>

        {/* ===== TAG SUGGESTIONS ===== */}
        {tagInput && (
          <div className={styles.tagSuggestions}>
            {suggestions.length > 0 ? (
              suggestions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => addExistingTag(t.name)}
                >
                  {t.label}
                </button>
              ))
            ) : (
              <div className={styles.tagHint}>No matching tag</div>
            )}
          </div>
        )}

        {/* ===== TAG PREVIEW ===== */}
        {localTags.length > 0 && (
          <div className={styles.tagPreview}>
            {localTags.map((t) => {
              const meta = tags.find((x) => x.name === t);
              return (
                <span key={t} className={styles.tagChip}>
                  {meta?.label ?? t}
                  <button type="button" onClick={() => removeTag(t)}>
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {resolveError && <div className={styles.error}>{resolveError}</div>}

        {/* ===== ACTIONS ===== */}
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
                  const rec = await getRecord(Number(match[1]));
                  if (!rec) throw new Error();

                  resolved = mapEad3ToBookmark(rec, {
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

              tagCtx.ensureTags(localTags);

              onSave({
                ...resolved,
                categoryId,
                customName: customName.trim(),
                tags: localTags,
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
